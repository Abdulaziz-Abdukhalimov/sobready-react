import { Box, Container, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { retrievePopularProducts } from "./selector";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import CardCover from "@mui/joy/CardCover";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

//REDUX SElECTOR
const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts })
);

export default function BestSellings() {
  const { popularProducts } = useSelector(popularProductsRetriever);
  const { t } = useTranslation();

  return (
    <div className="best-selling">
      <Container>
        <Stack className="bestsell-section">
          <Box className="best-title">{t("home.bestSelling")}</Box>
          <Stack className="best-cards">
            {popularProducts.length !== 0 ? (
              popularProducts.map((product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <CssVarsProvider key={product._id}>
                    <Card className="card">
                      <Box className="product-label">
                        {product.productGender}
                      </Box>

                      <CardCover>
                        <img src={imagePath} alt="" />
                      </CardCover>
                      <CardCover className="card-cover" />
                      <CardContent sx={{ justifyContent: "flex-end" }}>
                        <Stack
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                        >
                          <CardOverflow>
                            <Stack className="card-info">
                              <Typography className="product-name">
                                {product.productName}
                              </Typography>
                              <Box className="product-shortInfo">
                                <span>{product.productBrand}</span>
                                <span>
                                  {product.productType.toLocaleLowerCase()} (
                                  {product.productVolume})
                                </span>
                              </Box>
                              <Box className={"price"}>
                                $ {product.productPrice}
                              </Box>
                            </Stack>
                          </CardOverflow>
                        </Stack>
                      </CardContent>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">{t("home.noProducts")}</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
