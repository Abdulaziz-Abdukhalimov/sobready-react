// store/slices/likeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeItems } from "../../lib/types/screen";
import { LikeItem } from "../../lib/types/Likes";

const likeJson: string | null = localStorage.getItem("likeData");
const initialState: LikeItems = {
  likeItems: likeJson ? (JSON.parse(likeJson) as LikeItem[]) : [],
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<LikeItem>) => {
      const exist = state.likeItems.find(
        (item) => item._id === action.payload._id
      );
      let updatedLikes;

      if (exist) {
        // Unlike: remove from array
        updatedLikes = state.likeItems.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        // Like: add to array
        updatedLikes = [...state.likeItems, action.payload];
      }

      localStorage.setItem("likeData", JSON.stringify(updatedLikes));
      state.likeItems = updatedLikes;
    },

    setLikes: (state, action: PayloadAction<LikeItem[]>) => {
      // Use this to sync with backend data
      localStorage.setItem("likeData", JSON.stringify(action.payload));
      state.likeItems = action.payload;
    },

    removeLike: (state, action: PayloadAction<string>) => {
      const updatedLikes = state.likeItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("likeData", JSON.stringify(updatedLikes));
      state.likeItems = updatedLikes;
    },

    clearAllLikes: (state) => {
      localStorage.removeItem("likeData");
      state.likeItems = [];
    },
  },
});

export const { toggleLike, setLikes, removeLike, clearAllLikes } =
  likeSlice.actions;
const LikeReducer = likeSlice.reducer;

export default LikeReducer;
