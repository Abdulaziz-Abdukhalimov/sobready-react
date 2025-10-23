import { Stack, Typography } from "@mui/material";

export default function OurValues() {
  return (
    <div className="our-values">
      <Stack>
        <img src="/img/aroValue.png" alt="" />
      </Stack>
      <Stack className="value-content">
        <Typography className="value-title">Our Values</Typography>
        <div className="value-txt">
          At Local Face, our perfume retail store is built on a foundation of
          passion and authenticity. We believe in celebrating the individuality
          of every customer, providing a diverse collection of scents that
          resonate with their unique personality and style. Our dedicated team
          of fragrance enthusiasts is committed to creating a welcoming and
          inclusive environment, where connections are forged, and inspiration
          thrives.
          <br />
          <br />
          Embracing sustainability and continuous learning, Local Face strives
          to be more than just a shopping destination; we are a community that
          inspires and empowers individuals on their fragrance journey.
        </div>
      </Stack>
    </div>
  );
}
