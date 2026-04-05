import React, { useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import { useState, SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import "../../../css/order.css";
import { Dispatch } from "@reduxjs/toolkit";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { useDispatch } from "react-redux";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import PausedOrders from "./PausedOrders";
import ProccessOrders from "./ProccessOrders";
import FinishedOrders from "./FinishedOrders";
import { setFinishedOrders, setPausedOrders, setProccessOrders } from "./slice";
import { useTranslation } from "react-i18next";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProccessOrders: (data: Order[]) => dispatch(setProccessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();

  const { t } = useTranslation();
  if (!authMember) history.push("/");
  const { setPausedOrders, setProccessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());

  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PENDING,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PENDING })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESSING })
      .then((data) => setProccessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.DELIVERED })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="order-page">
      <Container maxWidth="xl" className="order-container">
        <h1 className="order-page-title">{t("orders.title")}</h1>

        <Box className="order-tabs-wrapper">
          <Tabs
            value={value}
            onChange={handleChange}
            className="order-tabs"
            variant="fullWidth"
          >
            <Tab label={t("orders.pending")} value={"1"} />
            <Tab label={t("orders.processing")} value={"2"} />
            <Tab label={t("orders.completed")} value={"3"} />
          </Tabs>
        </Box>

        <TabContext value={value}>
          <PausedOrders setValue={setValue} />
          <ProccessOrders setValue={setValue} />
          <FinishedOrders />
        </TabContext>
      </Container>
    </div>
  );
}
