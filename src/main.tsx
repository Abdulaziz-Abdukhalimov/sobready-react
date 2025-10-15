import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./css/index.css";
import App from "./app/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "./app/store"; // Import Redux store;
import theme from "./app/MaterialTheme/index";
import { BrowserRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
