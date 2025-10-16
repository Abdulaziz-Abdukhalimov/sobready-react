import { Box, Button, Container, Stack } from "@mui/material";

export function HomePage() {
  const authmember = null;
  return (
    <div className="home-page">
      <Container className="home-container">
        <Stack direction="row" className="home-content">
          {/* LEFT SIDE */}
          <Stack className="home-text">
            <Box className="home-title">
              Elevate Your Spirit with Victory Scented Fragrances!
            </Box>
            <Box className="home-subtext">
              Shop now and embrace the sweet smell of victory with Local Face.
            </Box>
            {!authmember ? (
              <Button variant="contained" className="home-btn">
                Sign Up
              </Button>
            ) : null}
          </Stack>

          {/* RIGHT SIDE */}
          <Box className="home-image">
            <img src="/img/aroBanner.png" alt="Aromatica Banner" />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
