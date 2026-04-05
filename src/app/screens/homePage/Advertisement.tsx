import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Advertisement() {
  const { t } = useTranslation();

  return (
    <div className="ads-frame">
      <Stack className="ads-container" direction="row">
        <Box className="ads-image">
          <img src="/img/add1.jpg" alt="Perfume Sale" />
        </Box>
        <Box className="ads-text">
          <h2>{t("home.ad.title")}</h2>
          <p>{t("home.ad.desc")}</p>
          <a href="/products" className="ads-link">
            {t("home.ad.button")}
          </a>
        </Box>
      </Stack>
    </div>
  );
}
