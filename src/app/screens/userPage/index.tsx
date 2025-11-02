import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { serverApi, Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";
import { retrieveFinishedOrders } from "../ordersPage/selector";
import { retrieveLikeItems } from "../../likeStore/selector";

// REDUX SELECTORS
const userStatsRetriever = createSelector(
  retrieveFinishedOrders,
  retrieveLikeItems,
  (finishedOrders, likeItems) => ({
    finishedOrders,
    likeItems,
  })
);

export default function UserProfilePage() {
  const { authMember, setAuthMember } = useGlobals();
  const { finishedOrders, likeItems } = useSelector(userStatsRetriever);

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick || "",
      memberPhone: authMember?.memberPhone || "",
      memberAddress: authMember?.memberAddress || "",
      memberDesc: authMember?.memberDesc || "",
      memberImage: authMember?.memberImage || "",
    }
  );

  // Calculate total spent from finished orders
  const totalSpent =
    finishedOrders?.reduce((sum, order) => sum + order.orderTotal, 0) || 0;
  const totalOrders = finishedOrders?.length || 0;
  const totalWishlist = likeItems?.length || 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // HANDLERS
  const memberNickHandler = (e: T) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberNick: e.target.value });
  };

  const memberPhoneHandler = (e: T) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberPhone: e.target.value });
  };

  const memberAddressHandler = (e: T) => {
    setMemberUpdateInput({
      ...memberUpdateInput,
      memberAddress: e.target.value,
    });
  };

  const memberDescHandler = (e: T) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberDesc: e.target.value });
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file?.type;
    const validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error3).then();
    } else {
      if (file) {
        setMemberUpdateInput({ ...memberUpdateInput, memberImage: file });
        setMemberImage(URL.createObjectURL(file));
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      if (
        !memberUpdateInput.memberNick ||
        !memberUpdateInput.memberPhone ||
        !memberUpdateInput.memberAddress
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);
      setIsEditing(false);

      await sweetTopSmallSuccessAlert("Profile updated successfully", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setMemberUpdateInput({
      memberNick: authMember?.memberNick || "",
      memberPhone: authMember?.memberPhone || "",
      memberAddress: authMember?.memberAddress || "",
      memberDesc: authMember?.memberDesc || "",
      memberImage: authMember?.memberImage || "",
    });
    setMemberImage(
      authMember?.memberImage
        ? `${serverApi}/${authMember.memberImage}`
        : "/icons/default-user.svg"
    );
    setIsEditing(false);
  };

  if (!authMember) return null;

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        py: 6,
        paddingTop: "150px",
      }}
    >
      <Container maxWidth="lg">
        {/* Profile Header Card */}
        <Card sx={{ mb: 4, borderRadius: "16px", overflow: "visible" }}>
          <Box
            sx={{
              height: "200px",
              background: "#304835",
              position: "relative",
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                position: "absolute",
                bottom: "-60px",
                left: "40px",
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 140,
                    height: 140,
                    border: "5px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  src={memberImage}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    backgroundColor: "#ab8e66",
                    color: "white",
                    "&:hover": { backgroundColor: "#d4af37" },
                    width: 36,
                    height: 36,
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 18 }} />
                  <input type="file" hidden onChange={handleImageViewer} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ pt: 10, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {authMember.memberNick}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {authMember.memberPhone || "No phone number"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since{" "}
                  {moment(authMember.createdAt).format("MMMM YYYY")}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                sx={{
                  borderColor: "#ab8e66",
                  color: "#ab8e66",
                  "&:hover": {
                    borderColor: "#d4af37",
                    backgroundColor: "rgba(171, 142, 102, 0.1)",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Stats */}
            <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
              <Box
                sx={{
                  flex: "1 1 250px",
                  textAlign: "center",
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                }}
              >
                <LocalShippingIcon
                  sx={{ fontSize: 32, color: "#ab8e66", mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {totalOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: "1 1 250px",
                  textAlign: "center",
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                }}
              >
                <FavoriteIcon sx={{ fontSize: 32, color: "#ab8e66", mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {totalWishlist}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wishlist Items
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: "1 1 250px",
                  textAlign: "center",
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#ab8e66" }}
                >
                  ${totalSpent.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card sx={{ borderRadius: "16px" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: "1px solid #e0e0e0",
              px: 3,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 500,
              },
              "& .Mui-selected": {
                color: "#ab8e66 !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ab8e66",
              },
            }}
          >
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label="Personal Info"
            />
            <Tab
              icon={<SecurityIcon />}
              iconPosition="start"
              label="Security"
            />
            <Tab
              icon={<NotificationsIcon />}
              iconPosition="start"
              label="Preferences"
            />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {/* Personal Info Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Personal Information
                </Typography>

                {/* First Row */}
                <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 300px" }}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={memberUpdateInput.memberNick}
                      onChange={memberNickHandler}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 300px" }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={memberUpdateInput.memberPhone}
                      onChange={memberPhoneHandler}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Second Row */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={memberUpdateInput.memberAddress}
                    onChange={memberAddressHandler}
                    disabled={!isEditing}
                    variant="outlined"
                  />
                </Box>

                {/* Third Row */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={memberUpdateInput.memberDesc}
                    onChange={memberDescHandler}
                    disabled={!isEditing}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Box>

                {isEditing && (
                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveChanges}
                      sx={{
                        backgroundColor: "#122717",
                        "&:hover": { backgroundColor: "#0d1a10" },
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{
                        borderColor: "#ddd",
                        color: "#666",
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Security Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Security Settings
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Change Password
                    </Typography>

                    {/* Current Password */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        variant="outlined"
                      />
                    </Box>

                    {/* New Password Row */}
                    <Box
                      sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}
                    >
                      <Box sx={{ flex: "1 1 300px" }}>
                        <TextField
                          fullWidth
                          type="password"
                          label="New Password"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 300px" }}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirm New Password"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#122717",
                        "&:hover": { backgroundColor: "#0d1a10" },
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Two-Factor Authentication
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Add an extra layer of security to your account
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#ab8e66",
                        color: "#ab8e66",
                      }}
                    >
                      Enable 2FA
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Preferences Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Notification Preferences
                </Typography>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Order Updates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive notifications about your orders
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Enabled
                    </Button>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Promotional Emails
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive exclusive offers and promotions
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Enabled
                    </Button>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        New Arrivals
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Be the first to know about new products
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Disabled
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
