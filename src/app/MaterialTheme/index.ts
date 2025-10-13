import { createTheme } from "@mui/material/styles";
import { common } from "@mui/material/colors";
import shadow from "./shadow";
import typography from "./typography";
import { maxWidth } from "@mui/system";

/**
 * LIGHT THEME (DEFAULT)
 */
const light = {
  palette: {
    type: "light",
    background: {
      default: "rgb(245, 245, 245)",
      paper: common.white,
    },
    primary: {
      contrastText: "rgb(245, 245, 245)",
      main: "rgb(48, 72, 53)",
    },
    secondary: {
      contrastText: "#343434",
      main: "rgb(138, 114, 82)",
    },
    text: {
      primary: "#343434",
      secondary: "#d7b586",
      dark: common.black,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          height: "100%",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: "100%" },
        body: {
          background: "rgb(245, 245, 245)",
          height: "100%",
          minHeight: "100%",
        },
      },
    },
  },
  shadow,
  typography,
};

// A custom theme for this app
let theme = createTheme(light);
theme = createTheme(theme, {
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1300px",
          },
        },
      },
    },
  },
});

export default theme;
