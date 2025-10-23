import { Container, Stack } from "@mui/material";

export default function BestSellings() {
  return (
    <div className="best-selling">
      <Container className="bestSell-container">
        <Stack className="best-title">Best Sellings</Stack>
        <Stack className="best-cards">
          <Stack className="card">1</Stack>
          <Stack className="card">2</Stack>
          <Stack className="card">3</Stack>
          <Stack className="card">4</Stack>
        </Stack>
      </Container>
    </div>
  );
}
