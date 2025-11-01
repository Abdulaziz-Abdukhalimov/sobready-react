// store/selectors/likeSelector.ts
import { createSelector } from "@reduxjs/toolkit";
import { AppRootState } from "../../lib/types/screen";

const selectLike = (state: AppRootState) => state.like;

export const retrieveLikeItems = createSelector(
  selectLike,
  (Like) => Like.likeItems
);

export const retrieveIsLiked = (productId: string) =>
  createSelector(selectLike, (Like) =>
    Like.likeItems.some((item) => item._id === productId)
  );

export const retrieveLikeCount = createSelector(
  selectLike,
  (Like) => Like.likeItems.length
);
