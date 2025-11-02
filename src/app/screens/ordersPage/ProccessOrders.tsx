import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const processOrderRetriever = createSelector(
  retrieveProccessOrders,
  (proccessOrders) => ({
    proccessOrders,
  })
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

interface ConfirmDialogState {
  open: boolean;
  orderId: string;
}

export default function ProccessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { proccessOrders } = useSelector(processOrderRetriever);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    orderId: "",
  });

  const openConfirmDialog = (orderId: string) => {
    setConfirmDialog({ open: true, orderId });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, orderId: "" });
  };

  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      openConfirmDialog(orderId);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleConfirm = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const input: OrderUpdateInput = {
        orderId: confirmDialog.orderId,
        orderStatus: OrderStatus.DELIVERED,
      };

      const order = new OrderService();
      await order.updateOrder(input);
      setValue("3");
      setOrderBuilder(new Date());
      closeConfirmDialog();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
      closeConfirmDialog();
    }
  };

  return (
    <>
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
            <AddShoppingCartIcon
              className="empty-state-image"
              sx={{ color: "#ab8e66" }}
            />
            <Typography className="empty-state-text">
              No orders in process
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Custom Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "440px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogContent sx={{ padding: "32px 24px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#4caf50" }} />
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#111",
                mb: 1,
              }}
            >
              Confirm Order Receipt
            </Typography>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              Have you received your order in good condition? Confirming will
              mark this order as completed.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "0 24px 24px",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            onClick={handleConfirm}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              padding: "12px",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Yes, I Received It
          </Button>

          <Button
            onClick={closeConfirmDialog}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#ddd",
              color: "#666",
              padding: "12px",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#bbb",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
            }}
          >
            Not Yet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
