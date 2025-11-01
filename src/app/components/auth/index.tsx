import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { Button, Stack, TextField, Box, Typography, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  handleSignupOpen?: () => void;
  handleLoginOpen?: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const {
    signupOpen,
    loginOpen,
    handleSignupClose,
    handleLoginClose,
    handleSignupOpen,
    handleLoginOpen,
  } = props;

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  /** HANDLERS **/
  const handleUserName = (e: T) => {
    setMemberNick(e.target.value);
  };
  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };
  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handlePasswordKeydown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFulfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      handleSignupClose();

      // Reset fields
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
    } catch (error) {
      console.log(error);
      handleSignupClose();
      sweetErrorHandling(error).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      handleLoginClose();

      // Reset fields
      setMemberNick("");
      setMemberPassword("");
    } catch (error) {
      console.log(error);
      handleLoginClose();
      sweetErrorHandling(error).then();
    }
  };

  const switchToSignup = () => {
    handleLoginClose();
    if (handleSignupOpen) handleSignupOpen();
  };

  const switchToLogin = () => {
    handleSignupClose();
    if (handleLoginOpen) handleLoginOpen();
  };

  return (
    <div>
      {/* LOGIN MODAL */}
      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={loginOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 450,
              bgcolor: "#ffffff",
              boxShadow: 24,
              p: 0,
              outline: "none",
            }}
          >
            {/* Header with Logo */}
            <Box
              sx={{
                textAlign: "center",
                pt: 4,
                pb: 2,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Typography color="#ab8e66">SEPHORA</Typography>
            </Box>

            {/* Back Button */}
            <Box sx={{ px: 4, pt: 3 }}>
              <Link
                onClick={handleLoginClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#666",
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "14px",
                  "&:hover": { color: "#333" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                BACK
              </Link>
            </Box>

            {/* Form Content */}
            <Box sx={{ px: 4, py: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 4, fontWeight: 400, color: "#333" }}
              >
                Sign In
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "#666", fontSize: "13px" }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    id="login-email"
                    variant="outlined"
                    value={memberNick}
                    onChange={handleUserName}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ab8e66",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ab8e66",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "#666", fontSize: "13px" }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    id="login-password"
                    type="password"
                    variant="outlined"
                    value={memberPassword}
                    onChange={handlePassword}
                    onKeyDown={handlePasswordKeydown}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ab8e66",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ab8e66",
                        },
                      },
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLoginRequest}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: "#2d4a2b",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 400,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1f3620",
                    },
                  }}
                >
                  Continue
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Link
                    href="#"
                    sx={{
                      color: "#666",
                      fontSize: "13px",
                      textDecoration: "underline",
                      "&:hover": { color: "#333" },
                    }}
                  >
                    Forgotten your password?
                  </Link>
                </Box>
              </Stack>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, fontSize: "14px" }}
                >
                  Don't have an online account?
                </Typography>
                <Link
                  onClick={switchToSignup}
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                    textDecoration: "underline",
                    cursor: "pointer",
                    "&:hover": { color: "#333" },
                  }}
                >
                  Register now
                </Link>
              </Box>
            </Box>

            {/* Footer Links */}
            <Box
              sx={{
                px: 4,
                py: 3,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Cookies
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Security & Privacy Policy
              </Link>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* SIGNUP MODAL */}
      <Modal
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={signupOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 450,
              bgcolor: "#ffffff",
              boxShadow: 24,
              p: 0,
              outline: "none",
            }}
          >
            {/* Header with Logo */}
            <Box
              sx={{
                textAlign: "center",
                pt: 4,
                pb: 2,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box
                component="img"
                src="/icons/logo.svg"
                alt="Logo"
                sx={{ height: 40, mb: 2 }}
              />
            </Box>

            {/* Back Button */}
            <Box sx={{ px: 4, pt: 3 }}>
              <Link
                onClick={handleSignupClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#666",
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "14px",
                  "&:hover": { color: "#333" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                BACK
              </Link>
            </Box>

            {/* Form Content */}
            <Box sx={{ px: 4, py: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 4, fontWeight: 400, color: "#333" }}
              >
                Register
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "#666", fontSize: "13px" }}
                  >
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    id="signup-username"
                    variant="outlined"
                    value={memberNick}
                    onChange={handleUserName}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ab8e66",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ab8e66",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "#666", fontSize: "13px" }}
                  >
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    id="signup-phone"
                    variant="outlined"
                    value={memberPhone}
                    onChange={handlePhone}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ab8e66",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ab8e66",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "#666", fontSize: "13px" }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    id="signup-password"
                    type="password"
                    variant="outlined"
                    value={memberPassword}
                    onChange={handlePassword}
                    onKeyDown={handlePasswordKeydown}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ab8e66",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ab8e66",
                        },
                      },
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSignupRequest}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: "#2d4a2b",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 400,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1f3620",
                    },
                  }}
                >
                  Continue
                </Button>
              </Stack>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 1, fontSize: "14px" }}
                >
                  Already have an account?
                </Typography>
                <Link
                  onClick={switchToLogin}
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                    textDecoration: "underline",
                    cursor: "pointer",
                    "&:hover": { color: "#333" },
                  }}
                >
                  Sign in
                </Link>
              </Box>
            </Box>

            {/* Footer Links */}
            <Box
              sx={{
                px: 4,
                py: 3,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Cookies
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#666",
                  fontSize: "12px",
                  textDecoration: "underline",
                }}
              >
                Security & Privacy Policy
              </Link>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
