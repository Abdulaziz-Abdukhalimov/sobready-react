import React from "react";
import { Box, Stack, Typography, Chip } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { retrieveFinishedOrders } from "./selector";

const finishedOrderRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({
    finishedOrders,
  })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrderRetriever);

  return (
    <TabPanel value={"3"} sx={{ padding: "0" }}>
      {finishedOrders && finishedOrders.length > 0 ? (
        <Stack spacing={3}>
          {finishedOrders.map((order: Order) => (
            <Box key={order._id} className="order-card">
              <Box className="order-card-left">
                <Box className="order-header-with-status">
                  <Typography variant="h6" className="order-section-title">
                    Order Items
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Completed"
                    className="order-status-chip completed"
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
                      Completed:{" "}
                      {moment(order.updatedAt).format("MMM DD, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Box className="order-completed-badge">
                  <CheckCircleIcon className="completed-icon" />
                  <Typography>Order Delivered Successfully</Typography>
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
            No completed orders yet
          </Typography>
        </Box>
      )}
    </TabPanel>
  );
}
