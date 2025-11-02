import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import {
  Container,
  Stack,
  Box,
  MenuItem,
  Select,
  Typography,
  Input,
  Button,
} from "@mui/material";
import ProductService from "../../services/ProductService";
import { useHistory } from "react-router-dom";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { onAdd } from "../../cartStore/slice";
import { toggleLike } from "../../likeStore/slice"; // ADD THIS
import { retrieveProducts } from "./selector";
import { retrieveLikeItems } from "../../likeStore/selector"; // ADD THIS
import {
  ProductFragrance,
  ProductGender,
  ProductType,
} from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import CardCover from "@mui/joy/CardCover";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

// === REDUX SETUP === //
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
  onAdd: (data: any) => dispatch(onAdd(data)),
  toggleLike: (data: any) => dispatch(toggleLike(data)),
});

const productsRetriever = createSelector(
  retrieveProducts,
  retrieveLikeItems,
  (products, likeItems) => ({
    products,
    likeItems,
  })
);

export default function Products() {
  const { setProducts, onAdd, toggleLike } = actionDispatch(useDispatch()); // ADD toggleLike
  const { products, likeItems } = useSelector(productsRetriever); // ADD likeItems
  const history = useHistory();

  // === FILTER STATES === //
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 16,
    order: "productPrice",
    //@ts-ignore
    productType: "",
    //@ts-ignore
    productGender: "",
    //@ts-ignore
    productFragrance: "",
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");

  // === HELPER FUNCTION TO CHECK IF PRODUCT IS LIKED === //
  const isLiked = (productId: string): boolean => {
    return likeItems.some((item: any) => item._id === productId);
  };

  // === FETCH PRODUCTS === //
  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((error) => console.log(error));
  }, [productSearch]);

  // === RESET SEARCH === //
  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  // === HANDLERS === //
  const handleTypeChange = (e: any) => {
    productSearch.page = 1;
    productSearch.productType = e.target.value;
    setProductSearch({ ...productSearch });
  };

  const handleFragranceChange = (e: any) => {
    productSearch.page = 1;
    productSearch.productFragrance = e.target.value;
    setProductSearch({ ...productSearch });
  };

  const handleGenderChange = (e: any) => {
    productSearch.page = 1;
    productSearch.productGender = e.target.value;
    setProductSearch({ ...productSearch });
  };

  const handleSortChange = (e: any) => {
    productSearch.page = 1;
    productSearch.order = e.target.value;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  // === LIKE HANDLER === //
  const handleLikeClick = (product: Product) => {
    const likeItem = {
      _id: product._id,
      productName: product.productName,
      productImages: product.productImages,
      productPrice: product.productPrice,
      productVolume: product.productVolume,
      productBrand: product.productBrand, // optional, if you want to show brand
      productType: product.productType, // optional
      productGender: product.productGender, // optional
    };
    toggleLike(likeItem);
  };

  // === RENDER === //
  return (
    <div className="products">
      <Container>
        <Box className="filter-header">
          <Typography className="best-title">Best Selling Products</Typography>

          <Stack
            className="filter-row"
            direction="row"
            spacing={3}
            alignItems="center"
          >
            <Box className="filter-group">
              <span>Filter by</span>
              <Select
                value={productSearch.productType}
                onChange={handleTypeChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value={ProductType.EAU_DE_PARFUM}>
                  Eau de Parfum
                </MenuItem>
                <MenuItem value={ProductType.EAU_DE_TOILETTE}>
                  Eau de Toilette
                </MenuItem>
                <MenuItem value={ProductType.BODY_SPRAY}>Body Spray</MenuItem>
              </Select>

              <Select
                value={productSearch.productFragrance}
                onChange={handleFragranceChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value="">Fragrance Families</MenuItem>
                <MenuItem value={ProductFragrance.FLORAL}>Floral</MenuItem>
                <MenuItem value={ProductFragrance.WOODY}>Woody</MenuItem>
                <MenuItem value={ProductFragrance.CITRUS}>Citrus</MenuItem>
                <MenuItem value={ProductFragrance.ORIENTAL}>Oriental</MenuItem>
                <MenuItem value={ProductFragrance.FRESH}>Fresh</MenuItem>
                <MenuItem value={ProductFragrance.AROMATIC}>Aromatic</MenuItem>
              </Select>

              <Select
                value={productSearch.productGender}
                onChange={handleGenderChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value=""> Genders</MenuItem>
                <MenuItem value={ProductGender.MEN}>Men</MenuItem>
                <MenuItem value={ProductGender.WOMEN}>Women</MenuItem>
                <MenuItem value={ProductGender.UNISEX}>Unisex</MenuItem>
              </Select>
            </Box>

            <Box className="sort-group">
              <Stack flexDirection={"row"}>
                <div
                  style={{
                    position: "relative",
                    width: "260px",
                    marginBottom: "50px",
                  }}
                >
                  <input
                    type={"search"}
                    name={"singleSearch"}
                    placeholder="Type here.."
                    className="search-bar"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchProductHandler();
                    }}
                  />
                  {searchText && (
                    <Button
                      onClick={() => setSearchText("")}
                      sx={{
                        position: "absolute",
                        right: "90px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "7px",
                      }}
                    >
                      <ClearIcon sx={{ fontSize: "13px" }} />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    className="search-button"
                    onClick={searchProductHandler}
                  >
                    Search <SearchIcon sx={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </Stack>
              <span>Sort by</span>
              <Select
                value={productSearch.order}
                onChange={handleSortChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value="productPrice">Price</MenuItem>
                <MenuItem value="productViews">Views</MenuItem>
                <MenuItem value="createdAt">New</MenuItem>
              </Select>
            </Box>
          </Stack>
        </Box>

        <Stack
          className="product-grid"
          direction="row"
          flexWrap="wrap"
          spacing={3}
        >
          {products.length !== 0 ? (
            products.map((product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              const liked = isLiked(product._id); // CHECK IF LIKED

              return (
                <CssVarsProvider key={product._id}>
                  <Card
                    className="card"
                    onClick={() => chooseProductHandler(product._id)}
                  >
                    <Box className="product-label">{product.productGender}</Box>

                    <CardCover>
                      <img src={imagePath} alt="" />
                    </CardCover>
                    <CardCover className="card-cover" />
                    <CardContent sx={{ justifyContent: "flex-end" }}>
                      <Stack
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                      >
                        <CardOverflow>
                          <Stack className="card-info">
                            <Typography className="product-name">
                              {product.productName}
                            </Typography>
                            <Box className="product-shortInfo">
                              <span>{product.productBrand}</span>
                              <span>
                                {product.productType.toLocaleLowerCase()} (
                                {product.productVolume})
                              </span>
                            </Box>
                            <Box className={"price"}>
                              $ {product.productPrice}
                            </Box>
                          </Stack>
                        </CardOverflow>
                      </Stack>
                      {/* add to cart and like  */}
                      <Stack className="add-like-section">
                        <FavoriteIcon
                          onClick={(e) => {
                            e.stopPropagation(); // prevent card click
                            handleLikeClick(product); // TOGGLE LIKE
                          }}
                          className="like"
                          sx={{
                            color: liked ? "red" : "gray", // RED IF LIKED
                            cursor: "pointer",
                          }}
                        />
                        <LocalMallIcon
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                          }}
                          className="add-cart"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </CssVarsProvider>
              );
            })
          ) : (
            <Box className="no-data">Products are not available now </Box>
          )}
        </Stack>
      </Container>
      <div className="partners-section">
        <Container>
          <Box className="logo-title">Brands we partner with</Box>
          <Stack className="logo-cards">
            <Stack className="card">
              <img src="/img/diorPartner.jpg" alt="" />
            </Stack>
            <Stack className="card">
              <img src="/img/bulgariPartner.jpg" alt="" />
            </Stack>
            <Stack className="card">
              <img src="/img/chanelPartner.jpg" alt="" />
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
