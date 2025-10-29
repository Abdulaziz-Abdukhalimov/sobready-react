import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";
import { act } from "react";

const initialState: ProductsPageState = {
  admin: null,
  chosenProduct: null,
  products: [],
};

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setChosenProduct: (state, action) => {
      state.chosenProduct = action.payload;
    },
    setProducts: (state, action) => {
      console.log("action:", action);
      state.products = action.payload;
    },
  },
});

export const { setAdmin, setChosenProduct, setProducts } =
  productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;
export default ProductsPageReducer;
