// hooks/useLike.ts
import { useDispatch, useSelector } from "react-redux";

import { LikeItem } from "../../lib/types/Likes";
import { retrieveLikeItems } from "../likeStore/selector";
import { clearAllLikes, removeLike, toggleLike } from "../likeStore/slice";

const useLike = () => {
  const dispatch = useDispatch();
  const likeItems = useSelector(retrieveLikeItems);

  // Check if a product is liked
  const isLiked = (productId: string): boolean => {
    return likeItems.some((item) => item._id === productId);
  };

  // Toggle like/unlike
  const onToggleLike = async (product: LikeItem) => {
    try {
      // Optimistic update
      dispatch(toggleLike(product));
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      dispatch(toggleLike(product));
    }
  };

  // Remove a specific like
  const onRemoveLike = (productId: string) => {
    dispatch(removeLike(productId));
  };

  // Clear all likes
  const onClearAllLikes = () => {
    dispatch(clearAllLikes());
  };

  // Sync with backend (call this on app load or after login)
  const syncLikesWithBackend = async (memberId: string) => {
    try {
      // Fetch likes from backend
      // const response = await axios.get(`/api/member/likes`);
      // dispatch(setLikes(response.data));
    } catch (error) {
      console.error("Error syncing likes:", error);
    }
  };

  return {
    likeItems,
    isLiked,
    onToggleLike,
    onRemoveLike,
    onClearAllLikes,
    syncLikesWithBackend,
  };
};

export default useLike;
