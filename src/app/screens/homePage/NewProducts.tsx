import { Box, Container, Stack } from "@mui/material";
import { retrieveNewProducts, retrievePopularProducts } from "./selector";
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
const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({
    newProducts,
  })
);

export default function NewProducts() {
  const { newProducts } = useSelector(newProductsRetriever);
  return (
    <div className="best-selling">
      <Container>
        <Stack className="bestsell-section">
          <Box className="best-title"> New Arrivals</Box>
          <Stack className="best-cards">
            {newProducts.length !== 0 ? (
              newProducts.map((product) => {
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
              <Box className="no-data">Products are not available now </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
