import { Box, Button, Container, Stack } from "@mui/material";
import { useState } from "react";
import { useGlobals } from "../../hooks/useGlobals";
import AuthenticationModal from "../../components/footer/auth";

export default function Banner() {
  const { authMember } = useGlobals();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  /** HANDLERS **/
  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  return (
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
          {!authMember ? (
            <Button
              variant="contained"
              className="home-btn"
              onClick={handleSignupOpen}
            >
              Sign Up
            </Button>
          ) : null}
        </Stack>

        {/* RIGHT SIDE */}
        <Box className="home-image">
          <img src="/img/aroBanner.png" alt="Aromatica Banner" />
        </Box>
      </Stack>

      {/* AUTHENTICATION MODAL */}
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
        handleSignupOpen={handleSignupOpen}
        handleLoginOpen={handleLoginOpen}
      />
    </Container>
  );
}
