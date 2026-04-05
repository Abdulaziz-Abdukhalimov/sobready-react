import axios from "axios";
import { serverApi } from "../../lib/config";
import { Member } from "../../lib/types/member";
import { Product } from "../../lib/types/product";
import { Order } from "../../lib/types/order";

class AdminService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  // ===================== MEMBERS =====================

  public async getAllMembers(): Promise<Member[]> {
    try {
      const url = this.path + "/user/all";
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log("Error getAllMembers", error);
      throw error;
    }
  }

  public async blockMember(memberId: string, memberStatus: string): Promise<Member> {
    try {
      const url = this.path + "/user/block";
      const result = await axios.post(url, { memberId, memberStatus }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log("Error blockMember", error);
      throw error;
    }
  }

  // ===================== PRODUCTS =====================

  public async createProduct(formData: FormData): Promise<Product> {
    try {
      const url = this.path + "/product/create";
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return result.data;
    } catch (error) {
      console.log("Error createProduct", error);
      throw error;
    }
  }

  public async updateProduct(formData: FormData): Promise<Product> {
    try {
      const url = this.path + "/product/update";
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return result.data;
    } catch (error) {
      console.log("Error updateProduct", error);
      throw error;
    }
  }

  public async deleteProduct(productId: string): Promise<void> {
    try {
      const url = this.path + "/product/delete";
      await axios.post(url, { productId }, { withCredentials: true });
    } catch (error) {
      console.log("Error deleteProduct", error);
      throw error;
    }
  }

  // ===================== ORDERS =====================

  public async getAllOrders(orderStatus?: string): Promise<Order[]> {
    try {
      let url = this.path + "/order/admin/all?page=1&limit=100";
      if (orderStatus) url += `&orderStatus=${orderStatus}`;
      const result = await axios.get(url, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log("Error getAllOrders", error);
      throw error;
    }
  }

  public async updateOrderStatus(orderId: string, orderStatus: string): Promise<Order> {
    try {
      const url = this.path + "/order/update";
      const result = await axios.post(url, { orderId, orderStatus }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log("Error updateOrderStatus", error);
      throw error;
    }
  }
}

export default AdminService;
