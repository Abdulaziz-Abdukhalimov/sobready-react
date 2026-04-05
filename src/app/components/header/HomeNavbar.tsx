import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import Cart from "./Cart";
import WishList from "./Like";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface HomeNavbarProps {
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    setLoginOpen,
    anchorEl,
    handleLogoutClick,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = (
    <>
      <Box className={"hover-line"}>
        <NavLink to="/" exact activeClassName={"underline"}>
          {t("nav.home")}
        </NavLink>
      </Box>
      <Box className={"hover-line"}>
        <NavLink to="/products" activeClassName={"underline"}>
          {t("nav.shop")}
        </NavLink>
      </Box>
      {authMember && (
        <Box className={"hover-line"}>
          <NavLink to="/orders" activeClassName={"underline"}>
            {t("nav.orders")}
          </NavLink>
        </Box>
      )}
      {authMember && (
        <Box className={"hover-line"}>
          <NavLink to="/member-page" activeClassName={"underline"}>
            {t("nav.myPage")}
          </NavLink>
        </Box>
      )}
      <Box className={"hover-line"}>
        <NavLink to="/help" activeClassName={"underline"}>
          {t("nav.help")}
        </NavLink>
      </Box>
    </>
  );

  return (
    <div className="home-navbar">
      <Container>
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Box>
            <NavLink to="/">
              <h2>SEPHORA</h2>
            </NavLink>
          </Box>

          {/* Desktop Navigation */}
          <Stack
            className="desktop-nav"
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            minWidth={"700px"}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks}
            <WishList />
            <Cart />
            <LanguageSwitcher />

            {!authMember ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#304835", color: "#f8f8ff" }}
                  className="login-button"
                  onClick={() => setLoginOpen(true)}
                >
                  {t("nav.login")}
                </Button>
              </Box>
            ) : (
              <img
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                }
                aria-haspopup={"true"}
                alt=""
                onClick={handleLogoutClick}
              />
            )}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                {t("nav.logout")}
              </MenuItem>
            </Menu>
          </Stack>

          {/* Mobile Navigation */}
          <Stack
            className="mobile-nav"
            flexDirection={"row"}
            alignItems={"center"}
            gap={1}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Cart />
            <WishList />
            <LanguageSwitcher />
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#ab8e66" }}>
              <MenuIcon />
            </IconButton>
          </Stack>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box className="mobile-drawer-nav">
              <Box className="drawer-header">
                <h2>SEPHORA</h2>
                <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#ab8e66" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box className="drawer-links" onClick={() => setDrawerOpen(false)}>
                <NavLink to="/" exact activeClassName="active">{t("nav.home")}</NavLink>
                <NavLink to="/products" activeClassName="active">{t("nav.shop")}</NavLink>
                {authMember && <NavLink to="/orders" activeClassName="active">{t("nav.orders")}</NavLink>}
                {authMember && <NavLink to="/member-page" activeClassName="active">{t("nav.myPage")}</NavLink>}
                <NavLink to="/help" activeClassName="active">{t("nav.help")}</NavLink>
              </Box>
              <Box className="drawer-footer">
                {!authMember ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => { setDrawerOpen(false); setLoginOpen(true); }}
                    sx={{ bgcolor: "#304835", "&:hover": { bgcolor: "#1e3022" }, textTransform: "none" }}
                  >
                    {t("nav.login")}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => { setDrawerOpen(false); handleLogoutRequest(); }}
                    sx={{ color: "#d4af37", borderColor: "#d4af37", textTransform: "none" }}
                  >
                    {t("nav.logout")}
                  </Button>
                )}
              </Box>
            </Box>
          </Drawer>
        </Stack>
      </Container>
    </div>
  );
}
