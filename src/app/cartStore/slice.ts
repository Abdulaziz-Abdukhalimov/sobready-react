import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../lib/types/search";
import { CartItems } from "../../lib/types/screen";

const cartJson: string | null = localStorage.getItem("cartData");
const initialState: CartItems = {
  cartItems: cartJson ? (JSON.parse(cartJson) as CartItem[]) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    onAdd: (state, action: PayloadAction<CartItem>) => {
      const exist = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      let updatedCart;
      if (exist) {
        updatedCart = state.cartItems?.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cartItems, { ...action.payload }];
      }
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      state.cartItems = updatedCart;
    },
    onRemove: (state, action: PayloadAction<CartItem>) => {
      const exist = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (!exist) return;

      let updatedCart;
      if (exist.quantity === 1) {
        updatedCart = state.cartItems.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        updatedCart = state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      state.cartItems = updatedCart;
    },
    onDelete: (state, action: PayloadAction<CartItem>) => {
      const updatedCart = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      state.cartItems = updatedCart;
    },
    onDeleteAll: (state) => {
      localStorage.removeItem("cartData");
      state.cartItems = [];
    },
  },
});

export const { onAdd, onRemove, onDelete, onDeleteAll } = cartSlice.actions;
const CartReducer = cartSlice.reducer;

export default CartReducer;
