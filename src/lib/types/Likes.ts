export interface Like {
  _id: string;
  memberId: string;
  likeRefId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface LikeItem {
  _id: string;
  productName: string;
  productImages: string[];
  productPrice: number;
  productVolume: number;
  // Add other product fields you need
}

export interface LikeInput {
  memberId?: string;
  likeRefId: string;
}
