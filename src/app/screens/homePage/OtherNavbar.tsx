import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export function OtherNavbar() {
  const authmember = null;
  return (
    <div className="home-navbar">
      <Container>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Box>
            <NavLink to="/">
              <h2>AROMATICA</h2>
            </NavLink>
          </Box>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            minWidth={"700px"}
          >
            <Box className={"hover-line"}>
              <NavLink to="/" activeClassName={"underline"}>
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/products" activeClassName={"underline"}>
                Shop
              </NavLink>
            </Box>
            {authmember ? (
              <Box className={"hover-line"}>
                <NavLink to="/orders" activeClassName={"underline"}>
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authmember ? (
              <Box className={"hover-line"}>
                <NavLink to="/member-page" activeClassName={"underline"}>
                  My Page
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>

            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                <FavoriteBorderIcon />
              </NavLink>
            </Box>

            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                <LocalMallIcon />
              </NavLink>
            </Box>

            {!authmember ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#304835", color: "#f8f8ff" }}
                >
                  Login
                </Button>
              </Box>
            ) : (
              <img
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src="/icons/User.svg"
                alt=""
              />
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
