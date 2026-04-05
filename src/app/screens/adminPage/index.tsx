import { useEffect, useState } from "react";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { MemberType } from "../../../lib/enums/member.enum";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Avatar,
  Stack,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardTab from "./components/DashboardTab";
import ProductsTab from "./components/ProductsTab";
import MembersTab from "./components/MembersTab";
import OrdersTab from "./components/OrdersTab";
import { serverApi } from "../../../lib/config";

export default function AdminPage() {
  const { authMember } = useGlobals();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(0);

  // Guard: redirect if not admin
  useEffect(() => {
    if (!authMember || authMember.memberType !== MemberType.ADMIN) {
      history.push("/");
    }
  }, [authMember, history]);

  if (!authMember || authMember.memberType !== MemberType.ADMIN) {
    return null;
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#122717",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          py: 3,
        }}
      >
        {/* Admin Profile */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 4, px: 2 }}>
          <Avatar
            src={
              authMember?.memberImage
                ? `${serverApi}/${authMember.memberImage}`
                : "/icons/default-user.svg"
            }
            sx={{ width: 64, height: 64, border: "2px solid #d4af37" }}
          />
          <Typography variant="subtitle1" sx={{ color: "#d4af37", fontWeight: 600 }}>
            {authMember.memberNick}
          </Typography>
          <Typography variant="caption" sx={{ color: "#8a7252", textTransform: "uppercase" }}>
            Administrator
          </Typography>
        </Stack>

        {/* Navigation Tabs */}
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            flex: 1,
            "& .MuiTab-root": {
              color: "#a0a0a0",
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "15px",
              px: 3,
              py: 1.5,
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "#d4af37 !important",
              bgcolor: "rgba(212, 175, 55, 0.08)",
            },
            "& .MuiTabs-indicator": {
              left: 0,
              right: "auto",
              bgcolor: "#d4af37",
              width: 3,
            },
          }}
        >
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" />
          <Tab icon={<InventoryIcon />} iconPosition="start" label="Products" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Members" />
          <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Orders" />
        </Tabs>

        {/* Back to Store */}
        <Box
          onClick={() => history.push("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1.5,
            cursor: "pointer",
            color: "#a0a0a0",
            "&:hover": { color: "#d4af37" },
          }}
        >
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Back to Store</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Container maxWidth="xl" disableGutters>
          {activeTab === 0 && <DashboardTab />}
          {activeTab === 1 && <ProductsTab />}
          {activeTab === 2 && <MembersTab />}
          {activeTab === 3 && <OrdersTab />}
        </Container>
      </Box>
    </Box>
  );
}
