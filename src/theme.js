import { createTheme } from "@mui/material";

export const shades = {
  primary: {
    100: "#fcdfce",
    200: "#fabf9e",
    300: "#f79f6d",
    400: "#f57f3d",
    500: "#f25f0c",
    600: "#c24c0a",
    700: "#913907",
    800: "#612605",
    900: "#301302",
    1000: "#EB7635",
  },
  secondary: {
    100: "#dddddd",
    200: "#bababa",
    300: "#989898",
    400: "#757575",
    500: "#535353",
    600: "#424242",
    700: "#323232",
    800: "#212121",
    900: "#111111",
  },
  neutral: {
    100: "#ffffff",
    200: "#ffffff",
    300: "#ffffff",
    400: "#ffffff",
    500: "#ffffff",
    600: "#cccccc",
    700: "#999999",
    800: "#666666",
    900: "#333333",
  },

  background: {
    100: "#fdfdfd",
    200: "#fcfcfc",
    300: "#fafafa",
    400: "#f9f9f9",
    500: "#f7f7f7",
    600: "#c6c6c6",
    700: "#949494",
    800: "#636363",
    900: "#313131",
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: shades.primary[1000],
      dark: shades.primary[600],
    },
    secondary: {
      light: shades.secondary[100],
      main: shades.secondary[500],
    },
    neutral: {
      main: shades.neutral[500],
    },
    background: {
      main: shades.background[500],
      dark: shades.background[600],
    },
  },
  typography: {
    fontSize: 14,
    h1: {
      fontSize: 48,
    },
    h2: {
      fontSize: 36,
    },
    h3: {
      fontSize: 32,
    },
    h4: {
      fontSize: 20,
    },
    h5: {
      fontSize: 16,
    },
  },
});
