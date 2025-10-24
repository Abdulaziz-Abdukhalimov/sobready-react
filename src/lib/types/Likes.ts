export interface Like {
  _id: string;
  memberId: string;
  likeRefId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeInput {
  memberId: string;
  likeRefId: string;
}
