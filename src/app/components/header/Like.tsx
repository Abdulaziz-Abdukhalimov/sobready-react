import React from "react";
import {
  Box,
  Button,
  Stack,
  IconButton,
  Badge,
  Drawer,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useHistory } from "react-router-dom";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { removeLike, clearAllLikes } from "../../likeStore/slice";
import { retrieveLikeItems } from "../../likeStore/selector";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { CartItem } from "../../../lib/types/search";
import { onAdd } from "../../cartStore/slice";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const actionDispatch = (dispatch: Dispatch) => ({
  onRemoveLike: (productId: string) => dispatch(removeLike(productId)),
  onClearAllLikes: () => dispatch(clearAllLikes()),
  onAdd: (data: CartItem) => dispatch(onAdd(data)),
});

const likeItemsRetriever = createSelector(retrieveLikeItems, (likeItems) => ({
  likeItems,
}));

export default function WishList() {
  const { onRemoveLike, onClearAllLikes, onAdd } = actionDispatch(
    useDispatch()
  );
  const { likeItems } = useSelector(likeItemsRetriever);
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const viewProductHandler = (id: string) => {
    history.push(`/products/${id}`);
    setOpen(false);
  };

  // ADD TO CART HANDLER
  const addToCartHandler = (item: any) => {
    const cartItem: CartItem = {
      _id: item._id,
      quantity: 1,
      name: item.productName,
      price: item.productPrice,
      image: item.productImages[0],
    };
    onAdd(cartItem);
  };

  // ADD ALL TO CART HANDLER
  const addAllToCartHandler = () => {
    likeItems.forEach((item: any) => {
      const cartItem: CartItem = {
        _id: item._id,
        quantity: 1,
        name: item.productName,
        price: item.productPrice,
        image: item.productImages[0],
      };
      onAdd(cartItem);
    });
  };

  return (
    <Box>
      <IconButton onClick={toggleDrawer(true)}>
        <Badge badgeContent={likeItems.length} color="secondary">
          <FavoriteBorderOutlinedIcon sx={{ color: "#ab8e66" }} />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        classes={{ paper: "cart-drawer" }}
      >
        <Stack className="cart-container">
          <Box className="cart-header">
            <h2>My Wishlist</h2>
            <Button onClick={toggleDrawer(false)} className="close-btn">
              X
            </Button>
          </Box>

          <Divider />

          <Box className="cart-body">
            {likeItems.length === 0 ? (
              <div className="empty-text">Wishlist is empty!</div>
            ) : (
              likeItems.map((item: any) => {
                const imagePath = `${serverApi}/${item.productImages[0]}`;
                return (
                  <Box key={item._id} className="cart-item">
                    <img
                      src={imagePath}
                      alt={item.productName}
                      className="cart-item-img"
                      onClick={() => viewProductHandler(item._id)}
                      style={{ cursor: "pointer" }}
                    />
                    <Box className="cart-item-info">
                      <p
                        className="product-name"
                        onClick={() => viewProductHandler(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.productName}
                      </p>
                      <p className="product-price">${item.productPrice}</p>
                      {item.productBrand && (
                        <p style={{ fontSize: "0.9rem", color: "#666" }}>
                          {item.productBrand}
                        </p>
                      )}
                      {item.productVolume && (
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>
                          {item.productVolume}
                        </p>
                      )}
                      {/* ADD TO CART BUTTON FOR INDIVIDUAL ITEM */}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LocalMallIcon />}
                        onClick={() => addToCartHandler(item)}
                        sx={{
                          marginTop: "8px",
                          color: "#ab8e66",
                          borderColor: "#ab8e66",
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                          "&:hover": {
                            borderColor: "#8b6e46",
                            backgroundColor: "rgba(171, 142, 102, 0.04)",
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                    <FavoriteIcon
                      className="cancel-icon"
                      onClick={() => onRemoveLike(item._id)}
                    />
                  </Box>
                );
              })
            )}
          </Box>

          {likeItems.length !== 0 && (
            <Box className="cart-footer">
              <Divider />
              <div className="summary-row">
                <span>Total Items</span>
                <span>{likeItems.length}</span>
              </div>
              {/* ADD ALL TO CART BUTTON */}
              <Button
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                className="checkout-btn"
                onClick={addAllToCartHandler}
                sx={{
                  marginBottom: "10px",
                  backgroundColor: "#ab8e66",
                  "&:hover": {
                    backgroundColor: "#8b6e46",
                  },
                }}
              >
                Add All to Cart
              </Button>
              <Button
                startIcon={<DeleteSweepIcon />}
                variant="outlined"
                className="checkout-btn"
                onClick={onClearAllLikes}
                sx={{
                  color: "#ab8e66",
                  borderColor: "#ab8e66",
                  "&:hover": {
                    borderColor: "#8b6e46",
                    backgroundColor: "rgba(171, 142, 102, 0.04)",
                  },
                }}
              >
                Clear All Wishlist
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
