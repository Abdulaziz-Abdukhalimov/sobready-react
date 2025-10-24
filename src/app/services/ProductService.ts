import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.productFragrance)
        url += `&productFragrance=${input.productFragrance}`;
      if (input.productType) url += `&productType=${input.productType}`;
      if (input.productGender) url += `&productGender=${input.productGender}`;
      if (input.search) url += `&search=${input.search}`;

      const result = await axios.get(url);
      console.log("getProduct:", result);

      return result.data;
    } catch (error) {
      console.log("Error getProducts", error);
      throw error;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("result:", result);
      return result.data;
    } catch (error) {
      console.log("Error getProduct", error);
      throw error;
    }
  }
}

export default ProductService;
