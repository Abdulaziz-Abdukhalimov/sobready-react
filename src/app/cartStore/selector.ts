import { createSelector } from "@reduxjs/toolkit";
import { AppRootState } from "../../lib/types/screen";

const selectCart = (state: AppRootState) => state.cart;

export const retrieveCartItems = createSelector(
  selectCart,
  (Cart) => Cart.cartItems
);
