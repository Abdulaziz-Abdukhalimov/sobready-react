import React from "react";
import { Box, Stack, Button, Typography, Chip } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { T } from "../../../lib/types/common";
import { retrieveProccessOrders } from "./selector";

const processOrderRetriever = createSelector(
  retrieveProccessOrders,
  (proccessOrders) => ({
    proccessOrders,
  })
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProccessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { proccessOrders } = useSelector(processOrderRetriever);

  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"2"} sx={{ padding: "0" }}>
      {proccessOrders && proccessOrders.length > 0 ? (
        <Stack spacing={3}>
          {proccessOrders.map((order: Order) => (
            <Box key={order._id} className="order-card">
              <Box className="order-card-left">
                <Box className="order-header-with-status">
                  <Typography variant="h6" className="order-section-title">
                    Order Items
                  </Typography>
                  <Chip
                    label="In Transit"
                    className="order-status-chip processing"
                  />
                </Box>

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

                  <Box className="order-date">
                    <Typography variant="caption">
                      Order Date:{" "}
                      {moment(order.createdAt).format("MMM DD, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Box className="order-actions">
                  <Button
                    variant="contained"
                    className="order-received-btn"
                    onClick={finishOrderHandler}
                    value={order._id}
                    fullWidth
                  >
                    Confirm Receipt
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
            No orders in process
          </Typography>
        </Box>
      )}
    </TabPanel>
  );
}
