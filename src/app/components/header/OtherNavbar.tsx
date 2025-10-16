import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";

export function OtherNavbar() {
  const authmember = null;
  return (
    <div className="home-navbar">
      <Container sx={{ mt: "55px", height: "642pxpx" }}>
        <Stack
          sx={{ height: "50px" }}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <NavLink to="/">
              <h2>AROMATICA</h2>
            </NavLink>
          </Box>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            minWidth={"700px"}
            alignItems={"center"}
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
                <img src="/icons/Heart.svg" alt="favorite" />
              </NavLink>
            </Box>

            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                <img src="/icons/Handbag.svg" alt="cart" />
              </NavLink>
            </Box>

            {!authmember ? (
              <Box>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#3776CC", color: "#f8f8ff" }}
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
        <Stack> Aromatica Details </Stack>
      </Container>
    </div>
  );
}
