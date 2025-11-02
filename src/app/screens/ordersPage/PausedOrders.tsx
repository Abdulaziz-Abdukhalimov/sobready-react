import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaymentIcon from "@mui/icons-material/Payment";

const pausedOrderRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({
    pausedOrders,
  })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

interface ConfirmDialogState {
  open: boolean;
  type: "delete" | "process" | null;
  orderId: string;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrderRetriever);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    type: null,
    orderId: "",
  });

  const openConfirmDialog = (type: "delete" | "process", orderId: string) => {
    setConfirmDialog({ open: true, type, orderId });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: null, orderId: "" });
  };

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      openConfirmDialog("delete", orderId);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      openConfirmDialog("process", orderId);
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
        orderStatus:
          confirmDialog.type === "delete"
            ? OrderStatus.CANCELLED
            : OrderStatus.PROCESSING,
      };

      const order = new OrderService();
      await order.updateOrder(input);

      if (confirmDialog.type === "process") {
        setValue("2");
      }

      setOrderBuilder(new Date());
      closeConfirmDialog();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
      closeConfirmDialog();
    }
  };

  const dialogContent = {
    delete: {
      icon: <WarningAmberIcon sx={{ fontSize: 60, color: "#d32f2f" }} />,
      title: "Cancel Order",
      message:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      confirmText: "Yes, Cancel Order",
      confirmColor: "#d32f2f",
    },
    process: {
      icon: <PaymentIcon sx={{ fontSize: 60, color: "#ab8e66" }} />,
      title: "Proceed to Payment",
      message:
        "You're about to proceed with payment for this order. Continue to checkout?",
      confirmText: "Yes, Proceed",
      confirmColor: "#122717",
    },
  };

  const currentDialog = confirmDialog.type && dialogContent[confirmDialog.type];

  return (
    <>
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
            <AddShoppingCartIcon
              className="empty-state-image"
              sx={{ color: "#ab8e66" }}
            />
            <Typography className="empty-state-text">
              No pending orders
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
                backgroundColor:
                  confirmDialog.type === "delete"
                    ? "rgba(211, 47, 47, 0.1)"
                    : "rgba(171, 142, 102, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              {currentDialog?.icon}
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
              {currentDialog?.title}
            </Typography>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              {currentDialog?.message}
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
              backgroundColor: currentDialog?.confirmColor,
              color: "#fff",
              padding: "12px",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: currentDialog?.confirmColor,
                opacity: 0.9,
              },
            }}
          >
            {currentDialog?.confirmText}
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
            No, Go Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
