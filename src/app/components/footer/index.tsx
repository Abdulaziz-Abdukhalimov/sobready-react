import { Box, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const authMember = null;
  const { t } = useTranslation();

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
              {t("footer.newsletter")}
            </Box>
            <Box className={"foot-desc-txt"}>
              {t("footer.newsletterDesc")}
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
                <Box className={"foot-category-title"}>{t("footer.categories")}</Box>
                <Box className={"foot-category"}>
                  <Typography>Fashion</Typography>
                  <Typography>Jewelry</Typography>
                  <Typography>Sports</Typography>
                  <Typography>Electronics</Typography>
                  <Typography>Indoor</Typography>
                </Box>
              </Box>
            </Stack>
            <Stack className="shopping">
              <Box>
                <Box className={"foot-category-title"}>{t("footer.shopping")}</Box>
                <Box className={"foot-category"}>
                  <Typography>{t("footer.payments")}</Typography>
                  <Typography>{t("footer.deliveryOptions")}</Typography>
                  <Typography>{t("footer.buyerProtection")}</Typography>
                </Box>
              </Box>
            </Stack>
            <Stack className="customer">
              <Box>
                <Box className={"foot-category-title"}>{t("footer.customerCare")}</Box>
                <Box className={"foot-category"}>
                  <Typography>{t("footer.helpCentre")}</Typography>
                  <Typography>{t("footer.termsConditions")}</Typography>
                  <Typography>{t("footer.privacyPolicy")}</Typography>
                  <Typography>{t("footer.returnsRefund")}</Typography>
                  <Typography>{t("footer.surveyFeedback")}</Typography>
                </Box>
              </Box>
            </Stack>

            <Stack className="pages">
              <Box>
                <Box className={"foot-category-title"}>{t("footer.pages")}</Box>
                <Box className={"foot-category"}>
                  <Link to={"/"}>{t("nav.home")}</Link>
                  <Link to={"/products"}>{t("nav.shop")}</Link>
                  {authMember && <Link to="/orders">{t("nav.orders")}</Link>}
                  <Link to="/help">{t("nav.help")}</Link>
                  <Link to="/help">{t("footer.contactUs")}</Link>
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
          {t("footer.copyright")}
        </Stack>
      </Container>
    </div>
  );
}
