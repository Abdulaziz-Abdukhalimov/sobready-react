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
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { onAdd, onDelete, onDeleteAll, onRemove } from "../../cartStore/slice";
import { retrieveCartItems } from "../../cartStore/selector";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const actionDispatch = (dispatch: Dispatch) => ({
  onAdd: (data: CartItem) => dispatch(onAdd(data)),
  onRemove: (data: CartItem) => dispatch(onRemove(data)),
  onDelete: (data: CartItem) => dispatch(onDelete(data)),
  onDeleteAll: () => dispatch(onDeleteAll()),
});

const cartItemsRetriever = createSelector(retrieveCartItems, (cartItems) => ({
  cartItems,
}));

export default function Cart() {
  const { onAdd, onRemove, onDelete, onDeleteAll } = actionDispatch(
    useDispatch()
  );
  const { cartItems } = useSelector(cartItemsRetriever);
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();

  const itemPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost: number = itemPrice < 1000 ? 30 : 0;
  const totalPrice = (itemPrice + shippingCost).toFixed(1);

  const [open, setOpen] = React.useState<null | HTMLElement>(null);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(e.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);
      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log("err");
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={cartItems.length} color="secondary">
          <LocalMallIcon sx={{ color: "#ab8e66" }} />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={Boolean(open)}
        onClose={handleClose}
        classes={{ paper: "cart-drawer" }}
      >
        <Stack className="cart-container">
          <Box className="cart-header">
            <h2>
              Shopping Bag
              <LocalMallIcon
                sx={{ color: "#ab8e66", paddingTop: "8px", fontSize: "30px" }}
              />
            </h2>
            <Button onClick={handleClose} className="close-btn">
              X
            </Button>
          </Box>

          <Divider />

          <Box className="cart-body">
            {cartItems.length === 0 ? (
              <div className="empty-text">
                <AddShoppingCartIcon />
                <br></br>
                Ups! you have to shop!
              </div>
            ) : (
              cartItems.map((item: CartItem) => {
                const imagePath = `${serverApi}/${item.image}`;
                return (
                  <Box key={item._id} className="cart-item">
                    <img src={imagePath} alt="" className="cart-item-img" />
                    <Box className="cart-item-info">
                      <p className="product-name">{item.name}</p>
                      <p className="product-price">
                        ${item.price} x {item.quantity}
                      </p>
                      <div className="quantity-box">
                        <button onClick={() => onRemove(item)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onAdd(item)}>+</button>
                      </div>
                    </Box>
                    <DeleteIcon
                      className="cancel-icon"
                      onClick={() => onDelete(item)}
                    />
                  </Box>
                );
              })
            )}
          </Box>

          {cartItems.length !== 0 && (
            <Box className="cart-footer">
              <Divider />
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>${itemPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shippingCost}</span>
              </div>
              <div className="summary-row discount-row">
                <span>Discount</span>
                <span>-$0</span>
              </div>
              <div className="summary-total">
                <strong>Total</strong>
                <strong>${totalPrice}</strong>
              </div>
              <Button
                startIcon={<DeleteSweepIcon />}
                variant="outlined"
                className="checkout-btn"
                onClick={onDeleteAll}
                sx={{
                  color: "#ab8e66",
                  borderColor: "#ab8e66",
                  "&:hover": {
                    borderColor: "#8b6e46",
                    backgroundColor: "rgba(171, 142, 102, 0.04)",
                  },
                }}
              >
                Clear All
              </Button>
              <Button
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                className="checkout-btn"
                onClick={proceedOrderHandler}
              >
                Secure Checkout Now
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
