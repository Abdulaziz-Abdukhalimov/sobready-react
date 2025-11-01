// REACT APP STATE.    //

import { Like, LikeItem } from "./Likes";
import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";
import { CartItem } from "./search";

export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  cart: CartItems;
  like: LikeItems;
  ordersPage: OrdersPageState;
}

//HOME PAGE
export interface HomePageState {
  popularProducts: Product[];
  newProducts: Product[];
  topUsers: Member[];
}

//PRODUCTS PAGE
export interface ProductsPageState {
  admin: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}
//ORDERS PAGE
export interface OrdersPageState {
  pausedOrders: Order[];
  proccessOrders: Order[];
  finishedOrders: Order[];
}
//CART ITEMS
export interface CartItems {
  cartItems: CartItem[];
}
//LIKE ITEMS
export interface LikeItems {
  likeItems: LikeItem[];
}
