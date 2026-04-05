import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function OurValues() {
  const { t } = useTranslation();

  return (
    <div className="our-values">
      <Stack>
        <img src="/img/aroValue.png" alt="" />
      </Stack>
      <Stack className="value-content">
        <Typography className="value-title">{t("home.values.title")}</Typography>
        <div className="value-txt">
          {t("home.values.p1")}
          <br />
          <br />
          {t("home.values.p2")}
        </div>
      </Stack>
    </div>
  );
}
