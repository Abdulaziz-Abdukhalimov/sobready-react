import { Box, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  const authMember = null;

  return (
    <div className="footer">
      <Container>
        <Stack
          flexDirection={"row"}
          sx={{ mt: "60px" }}
          className="footer-details"
        >
          <Stack
            flexDirection={"column"}
            style={{ width: "340px" }}
            className="footer-left"
          >
            <Box className="brand-name">SEPHORA</Box>
            <Box className={"foot-desc-title"}>
              Subscribe to Our Newsletter:
            </Box>
            <Box className={"foot-desc-txt"}>
              Receive Updates on New Arrivals and Special Promotions!
            </Box>
            <Box flexDirection={"row"} className={"find-us"}>
              <CallIcon sx={{ color: "white" }} />
              <div>+8210 11117777</div>
            </Box>
            <Box className={"find-us"}>
              <EmailIcon sx={{ color: "white" }} />
              <div>aroma@gmail.com</div>
            </Box>
            <Box className="sns-context">
              <img src={"/icons/Facebook.svg"} />
              <img src={"/icons/Linkedin.svg"} />
              <img src={"/icons/Twitter.svg"} />
              <img src={"/icons/Instagram.svg"} />
            </Box>
          </Stack>
          <Stack flexDirection={"row"} className="footer-right">
            <Stack className="categories">
              <Box>
                <Box className={"foot-category-title"}>Categories</Box>
                <Box className={"foot-category"}>
                  <Typography>Fashion</Typography>
                  <Typography>Jewelerry</Typography>
                  <Typography>Sports</Typography>
                  <Typography>Electronics</Typography>
                  <Typography>Indoor</Typography>
                </Box>
              </Box>
            </Stack>
            <Stack className="shopping">
              <Box>
                <Box className={"foot-category-title"}>Shopping</Box>
                <Box className={"foot-category"}>
                  <Typography>Payments</Typography>
                  <Typography>Delivery Options</Typography>
                  <Typography>Buyer Protection</Typography>
                </Box>
              </Box>
            </Stack>
            <Stack className="customer">
              <Box>
                <Box className={"foot-category-title"}>Customer Care</Box>
                <Box className={"foot-category"}>
                  <Typography>Help Centre</Typography>
                  <Typography>Term & Conditions</Typography>
                  <Typography>Privacy Policy</Typography>
                  <Typography>Returns & Refund</Typography>
                  <Typography>Survey & Feedback</Typography>
                </Box>
              </Box>
            </Stack>

            <Stack className="pages">
              <Box>
                <Box className={"foot-category-title"}>Pages</Box>
                <Box className={"foot-category"}>
                  <Link to={"/"}>Home</Link>
                  <Link to={"/products"}>Shop</Link>
                  {authMember && <Link to="/orders">Orders</Link>}
                  <Link to="/help">Help</Link>
                  <Link to="/help">Contact Us</Link>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #ffffff", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          © 2025 Aromatica Inc. All rights reserved
        </Stack>
      </Container>
    </div>
  );
}
