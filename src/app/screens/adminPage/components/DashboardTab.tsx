import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AdminService from "../../../services/AdminService";
import { Member } from "../../../../lib/types/member";
import { Product } from "../../../../lib/types/product";
import { Order } from "../../../../lib/types/order";
import ProductService from "../../../services/ProductService";

export default function DashboardTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = new AdminService();
    const productService = new ProductService();

    Promise.all([
      admin.getAllMembers(),
      productService.getProducts({ order: "createdAt", page: 1, limit: 1000 }),
      admin.getAllOrders(),
    ])
      .then(([membersData, productsData, ordersData]) => {
        setMembers(membersData);
        setProducts(productsData);
        setOrders(ordersData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#304835" }} />
      </Box>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.orderTotal || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "PROCESSING").length;

  const stats = [
    {
      title: "Total Members",
      value: members.length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#304835",
      bg: "#e8f5e9",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: "#1565c0",
      bg: "#e3f2fd",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: "#e65100",
      bg: "#fff3e0",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#122717", mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: "wrap" }}>
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            sx={{
              flex: "1 1 220px",
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: stat.bg,
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Quick Info */}
      <Stack direction="row" spacing={3}>
        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#122717", mb: 2 }}>
              Order Status
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#666" }}>Pending</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#e65100" }}>
                  {pendingOrders}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#666" }}>Processing</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1565c0" }}>
                  {processingOrders}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#666" }}>Delivered</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#2e7d32" }}>
                  {orders.filter((o) => o.orderStatus === "DELIVERED").length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#122717", mb: 2 }}>
              Recent Members
            </Typography>
            <Stack spacing={1}>
              {members.slice(0, 5).map((member) => (
                <Box
                  key={member._id}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography variant="body2">{member.memberNick}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: member.memberStatus === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                      color: member.memberStatus === "ACTIVE" ? "#2e7d32" : "#c62828",
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    {member.memberStatus}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
