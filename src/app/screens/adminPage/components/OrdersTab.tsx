import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import AdminService from "../../../services/AdminService";
import { Order } from "../../../../lib/types/order";
import Swal from "sweetalert2";
import moment from "moment";

const ORDER_STATUSES = ["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#fff3e0", color: "#e65100" },
  PROCESSING: { bg: "#e3f2fd", color: "#1565c0" },
  SHIPPED: { bg: "#f3e5f5", color: "#7b1fa2" },
  DELIVERED: { bg: "#e8f5e9", color: "#2e7d32" },
  CANCELLED: { bg: "#ffebee", color: "#c62828" },
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = (status?: string) => {
    const admin = new AdminService();
    admin
      .getAllOrders(status || undefined)
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchOrders(status);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const admin = new AdminService();
      await admin.updateOrderStatus(orderId, newStatus);
      await Swal.fire({
        icon: "success",
        title: `Order updated to ${newStatus}`,
        timer: 1000,
        showConfirmButton: false,
      });
      fetchOrders(filterStatus);
    } catch (err) {
      console.log(err);
      Swal.fire({ icon: "error", title: "Failed to update order" });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#122717" }}>
          Orders ({orders.length})
        </Typography>
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Orders</MenuItem>
          {ORDER_STATUSES.filter(Boolean).map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Delivery</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const statusColor = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.PENDING;
              return (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>#{order._id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${order.orderTotal}</TableCell>
                  <TableCell>${order.orderDelivery}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${order.orderItems?.length || 0} items`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.color,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#666", fontSize: "13px" }}>
                    {moment(order.createdAt).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(String(order._id), e.target.value)}
                      sx={{ minWidth: 140, fontSize: "13px" }}
                    >
                      {ORDER_STATUSES.filter(Boolean).map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              );
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#999" }}>
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
