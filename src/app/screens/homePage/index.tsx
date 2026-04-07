import OurValues from "./Values";
import Banner from "./Banner";
import BestSellings from "./BestSellingProducts";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductFragrance, ProductType } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { useEffect } from "react";
import { setNewProducts, setPopularProducts, setTopUsers } from "./slice";
import Advertisement from "./Advertisement";
import NewProducts from "./NewProducts";
import Events from "./Events";

// REDUX SLICE & SELCTOR //
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export function HomePage() {
  const { setPopularProducts, setNewProducts, setTopUsers } =
    actionDispatch(useDispatch());

  useEffect(() => {
    //Backend server data fetch
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productLikes",
        productType: ProductType.EAU_DE_TOILETTE,
      })
      .then((data) => {
        setPopularProducts(data);
      })
      .catch((err) => console.log(err));

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => {
        setNewProducts(data);
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="home-page">
      <Banner />
      <OurValues />
      <BestSellings />
      <Advertisement />
      <NewProducts />
      <Events />
    </div>
  );
}
