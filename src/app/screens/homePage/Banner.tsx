import { Box } from "@mui/material";
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
    <>
      <Box
        sx={{
          width: "100vw",
          height: "90vh",
          position: "relative",
          overflow: "hidden",
          marginLeft: "calc(-50vw + 50%)",
          marginTop: "35px",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/gZxQaZn7tv0?autoplay=1&mute=1&loop=1&playlist=gZxQaZn7tv0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
          title="Banner Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "177.78vh", /* 16:9 = always wide enough to cover height */
            height: "56.25vw",  /* 16:9 = always tall enough to cover width */
            minWidth: "100%",
            minHeight: "100%",
            pointerEvents: "none",
            border: "none",
          }}
        ></iframe>
      </Box>

      {/* AUTHENTICATION MODAL */}
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
        handleSignupOpen={handleSignupOpen}
        handleLoginOpen={handleLoginOpen}
      />
    </>
  );
}
