import { Route, Switch, useLocation } from "react-router-dom";
import OrdersPage from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HomePage } from "./screens/homePage";
import HomeNavbar from "./components/header/HomeNavbar";
import { HelpPage } from "./screens/helpPage";
import "../css/app.css";
import "../css/navbar.css";
import "../css/home.css";
import "../css/footer.css";
import "../css/order.css";
import OtherNavbar from "./components/header/OtherNavbar";
import Footer from "./components/footer";
import { useGlobals } from "./hooks/useGlobals";
import { useState } from "react";
import MemberService from "./services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import AuthenticationModal from "./components/auth";
import ProductsPage from "./screens/productsPage";

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /* HADNLERS */
  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
  };
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("successfully logged out", 600);
      setAuthMember(null);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  return (
    <>
      {location.pathname === "/" ? (
        <HomeNavbar
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      ) : (
        <OtherNavbar
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      )}
      <Switch>
        <Route path="/products">
          <ProductsPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </>
  );
}

export default App;
