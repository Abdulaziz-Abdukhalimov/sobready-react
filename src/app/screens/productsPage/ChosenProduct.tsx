import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { setChosenProduct } from "./slice";
import { CartItem } from "../../../lib/types/search";
import { onAdd, onRemove } from "../../cartStore/slice";
import { retrieveChosenProduct } from "./selector";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  Rating,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// REDUX SLICE & SELCTOR //
const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
  onAdd: (data: CartItem) => dispatch(onAdd(data)),
  onRemove: (data: CartItem) => dispatch(onRemove(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  })
);

export default function ChosenProduct() {
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, onAdd, onRemove } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);

  const [quantity, setQuantity] = useState<number>(1);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));
  }, []);

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  //Handle Accordian
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Handle add to cart
  const handleAddToCart = () => {
    if (chosenProduct) {
      const cartItem: CartItem = {
        _id: chosenProduct._id,
        quantity: quantity,
        name: chosenProduct.productName,
        price: chosenProduct.productPrice,
        image: chosenProduct.productImages[0],
      };
      onAdd(cartItem);
    }
  };

  if (!chosenProduct) return null;
  return (
    <div className="chosen-product">
      <Container className="chosen-container">
        <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
          {/* Left side - Product Image */}
          <Box sx={{ flex: 1 }}>
            <Box className="chosen-product-slider">
              <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="swiper-area"
              >
                {chosenProduct?.productImages.map(
                  (ele: string, index: number) => {
                    const imagePath = `${serverApi}/${ele}`;
                    return (
                      <SwiperSlide key={index}>
                        <img className="slider-image" src={imagePath} alt="" />
                      </SwiperSlide>
                    );
                  }
                )}
              </Swiper>
            </Box>
          </Box>

          {/* Right side - Product Details */}
          <Box sx={{ flex: 1 }}>
            <Box>
              <Typography
                variant="h3"
                sx={{ mb: 3, fontWeight: 400, letterSpacing: "0.5px" }}
                className="chosen-name"
              >
                {chosenProduct?.productName}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 3, lineHeight: 1.8, color: "#111" }}
              >
                {chosenProduct?.productDesc}
              </Typography>

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}
              >
                <Rating value={5} readOnly sx={{ color: "#d4af37" }} />
                <Typography variant="body2" sx={{ color: "#888" }}>
                  ({chosenProduct?.productSoldCount})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#888",
                    textDecoration: "underline",
                    cursor: "pointer",
                    ml: 1,
                  }}
                >
                  Sold and Ratings
                </Typography>
              </Box>

              {/* Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2}>
                  {/* 100ml Option */}
                  <Box
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      pb: 1,
                      borderBottom:
                        chosenProduct?.productVolume === 100
                          ? "2px solid #111"
                          : "none",
                      opacity: chosenProduct?.productVolume === 100 ? 1 : 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        chosenProduct?.productVolume === 100
                          ? "/img/100-active.png"
                          : "/img/100.png"
                      }
                      sx={{ width: 60, height: 80, mb: 1 }}
                    />
                    <Typography variant="body2" color="#111">
                      100 ml
                    </Typography>
                  </Box>

                  {/* 50ml Option */}
                  <Box
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      pb: 1,
                      borderBottom:
                        chosenProduct?.productVolume === 50
                          ? "2px solid #111"
                          : "none",
                      opacity: chosenProduct?.productVolume === 50 ? 1 : 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        chosenProduct?.productVolume === 50
                          ? "/img/50-active.png"
                          : "/img/50.png"
                      }
                      sx={{ width: 60, height: 80, mb: 1 }}
                    />
                    <Typography variant="body2" color="#111">
                      50 ml
                    </Typography>
                  </Box>

                  {/* 30ml Option */}
                  <Box
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      pb: 1,
                      borderBottom:
                        chosenProduct?.productVolume === 30
                          ? "2px solid #111"
                          : "none",
                      opacity: chosenProduct?.productVolume === 30 ? 1 : 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        chosenProduct?.productVolume === 30
                          ? "/img/30-active.png"
                          : "/img/30.png"
                      }
                      sx={{ width: 60, height: 80, mb: 1 }}
                    />
                    <Typography variant="body2" color="#111">
                      30 ml
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                sx={{ mb: 3, color: "#d4af37", fontWeight: 500 }}
              >
                $ {chosenProduct?.productPrice}
              </Typography>

              {/* Quantity and Wishlist */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1" sx={{ mr: 2, color: "#111" }}>
                    Qty
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ab8e66",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      sx={{ color: "#ab8e66", borderRadius: 0 }}
                      onClick={handleDecreaseQuantity}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ px: 3, py: 1, color: "#111" }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      sx={{ color: "#ab8e66", borderRadius: 0 }}
                      onClick={handleIncreaseQuantity}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  sx={{
                    borderColor: "#ab8e66",
                    "&:hover": {
                      borderColor: "#d4af37",
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                    },
                  }}
                >
                  Whish list
                  <FavoriteBorderIcon />
                </Button>
              </Stack>

              {/* Add to Bag Button */}
              <Button
                variant="contained"
                sx={{
                  py: 1.5,
                  mb: 2,
                  backgroundColor: "#122717",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 500,
                  width: "381px",
                  height: "48px",
                  "&:hover": { backgroundColor: "#122717" },
                }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              {/* Afterpay */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="img"
                  src="/img/afterPay.png"
                  sx={{ height: 20 }}
                />
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Shop now and pay later with 4 payments
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
        {/* Product Information Accordions */}
        <Box sx={{ mt: 8, maxWidth: "1200px", mx: "auto" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
            {/* Left Column - Product Story */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  color: "#111",
                }}
              >
                A scent as classic and refined as a perfectly tailored
                two-piece.
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#555" }}
              >
                This beguiling blend of floral, green and woody notes has
                achieved cult status around the world, and is Creed's
                best-selling fragrance. Suggestive of the perfumers equestrian
                and country roots, the fragrance offers notes of verbena, violet
                leaves, Florentine iris, sandalwood and ambergris, subtly
                orchestrated to create a fragrance that is elegant, irresistibly
                charming and evocative of the Emerald Isle.
              </Typography>
            </Box>

            {/* Right Column - Accordions */}
            <Box sx={{ flex: 1 }}>
              {/* Details Accordion */}
              <Accordion
                expanded={expanded === "details"}
                onChange={handleAccordionChange("details")}
                className="product-accordion"
                sx={{
                  boxShadow: "none",
                  borderTop: "1px solid #e0e0e0",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: "#ab8e66" }} />}
                  sx={{ py: 2 }}
                >
                  <Typography sx={{ fontWeight: 400, color: "#ab8e66" }}>
                    Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3 }}>
                  <Box component="ul" sx={{ pl: 2, color: "#555" }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Top Notes: Lemon Verbena, Peppermint, Iris
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Middle Notes: Violet Leaves
                    </Typography>
                    <Typography component="li">
                      Base Notes: Sandalwood, Ambergris
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Ingredients Accordion */}
              <Accordion
                expanded={expanded === "ingredients"}
                onChange={handleAccordionChange("ingredients")}
                className="product-accordion"
                sx={{
                  boxShadow: "none",
                  borderTop: "1px solid #e0e0e0",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: "#ab8e66" }} />}
                  sx={{ py: 2 }}
                >
                  <Typography sx={{ fontWeight: 400, color: "#ab8e66" }}>
                    Ingredients
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3 }}>
                  <Typography sx={{ color: "#555", lineHeight: 1.8 }}>
                    Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene,
                    Linalool, Citral, Geraniol, Citronellol, Coumarin, Eugenol,
                    Benzyl Benzoate, Farnesol, Benzyl Alcohol.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Delivery & Returns Accordion */}
              <Accordion
                expanded={expanded === "delivery"}
                onChange={handleAccordionChange("delivery")}
                className="product-accordion"
                sx={{
                  boxShadow: "none",
                  borderTop: "1px solid #e0e0e0",
                  borderBottom: "1px solid #e0e0e0",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: "#ab8e66" }} />}
                  sx={{ py: 2 }}
                >
                  <Typography sx={{ fontWeight: 400, color: "#ab8e66" }}>
                    Delivery & Returns
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3 }}>
                  <Typography sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
                    <strong>Delivery:</strong> Free standard shipping on orders
                    over $50. Express shipping available at checkout.
                  </Typography>
                  <Typography sx={{ color: "#555", lineHeight: 1.8 }}>
                    <strong>Returns:</strong> We offer a 30-day return policy
                    for unopened items in original packaging. Please contact our
                    customer service team to initiate a return.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Stack>
        </Box>
      </Container>
    </div>
  );
}
