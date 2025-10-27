import {
  ProductFragrance,
  ProductGender,
  ProductStatus,
  ProductType,
  ProductVolume,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productFragrance: ProductFragrance;
  productType: ProductType;
  productName: string;
  productBrand: string;
  productPrice: number;
  productStock: number;
  productGender: string;
  productSoldCount: number;
  productVolume: ProductVolume;
  productDesc?: string;
  productImages: string[];
  productView: number;
  productLikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productType?: ProductType;
  productFragrance?: ProductFragrance;
  productGender?: ProductGender;
  search?: string;
}
