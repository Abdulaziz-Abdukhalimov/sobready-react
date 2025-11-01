import React from "react";
import { Box, Stack, Button, Typography } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { retrievePausedOrders } from "./selector";

const pausedOrderRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({
    pausedOrders,
  })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrderRetriever);

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proceed with payment?"
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"1"} sx={{ padding: "0" }}>
      {pausedOrders && pausedOrders.length > 0 ? (
        <Stack spacing={3}>
          {pausedOrders.map((order: Order) => (
            <Box key={order._id} className="order-card">
              <Box className="order-card-left">
                <Typography variant="h6" className="order-section-title">
                  Order Items
                </Typography>

                <Stack spacing={2} className="order-items-list">
                  {order.orderItems.map((item: OrderItem) => {
                    const product: Product = order.productsData.filter(
                      (ele: Product) => item.productId === ele._id
                    )[0];
                    const imagePath = `${serverApi}/${product.productImages[0]}`;

                    return (
                      <Box key={item._id} className="order-item-row">
                        <img
                          src={imagePath}
                          alt={product.productName}
                          className="order-item-image"
                        />
                        <Box className="order-item-details">
                          <Typography className="order-item-name">
                            {product.productName}
                          </Typography>
                          <Typography className="order-item-brand">
                            {product.productBrand}
                          </Typography>
                          <Typography className="order-item-type">
                            {product.productType} ({product.productVolume})
                          </Typography>
                        </Box>
                        <Box className="order-item-pricing">
                          <Typography className="order-item-price">
                            ${item.itemPrice}
                          </Typography>
                          <Typography className="order-item-quantity">
                            Qty: {item.itemQuantity}
                          </Typography>
                          <Typography className="order-item-total">
                            ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Box className="order-card-right">
                <Typography variant="h6" className="order-section-title">
                  Order Summary
                </Typography>

                <Box className="order-summary">
                  <Box className="order-summary-row">
                    <Typography>Subtotal:</Typography>
                    <Typography>
                      ${(order.orderTotal - order.orderDelivery).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box className="order-summary-row">
                    <Typography>Delivery:</Typography>
                    <Typography>${order.orderDelivery.toFixed(2)}</Typography>
                  </Box>
                  <Box className="order-summary-divider" />
                  <Box className="order-summary-row order-total">
                    <Typography>Total:</Typography>
                    <Typography>${order.orderTotal.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Box className="order-actions">
                  <Button
                    variant="outlined"
                    className="order-cancel-btn"
                    onClick={deleteOrderHandler}
                    value={order._id}
                    fullWidth
                  >
                    Cancel Order
                  </Button>
                  <Button
                    variant="contained"
                    className="order-payment-btn"
                    value={order._id}
                    onClick={processOrderHandler}
                    fullWidth
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box className="order-empty-state">
          <img
            src="/icons/noimage-list.svg"
            alt="No orders"
            className="empty-state-image"
          />
          <Typography className="empty-state-text">
            No pending orders
          </Typography>
        </Box>
      )}
    </TabPanel>
  );
}
