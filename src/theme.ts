"use client";

import { createTheme } from "@mui/material/styles";

export const verde = "#2E7D32";
export const verdeClaro = "#4CAF50";
export const verdeOscuro = "#1B5E20";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: verde,
      light: verdeClaro,
      dark: verdeOscuro,
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#5F5F5F",
    },
    divider: "rgba(0, 0, 0, 0.10)",
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    h1: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontSize: "0.875rem", fontWeight: 600 },
    body1: { fontSize: "0.875rem", lineHeight: 1.6 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.55 },
    caption: { fontSize: "0.625rem", letterSpacing: "0.08em" },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundColor: "transparent",
          border: `1px solid ${t.palette.primary.main}`,
          color: t.palette.primary.main,
          borderRadius: 0,
          padding: "8px 18px",
          fontSize: "0.8125rem",
          boxShadow: `2px 2px 0px ${t.palette.primary.main}`,
          transition: "box-shadow 0.2s ease, filter 0.2s ease, transform 0.1s ease",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: `3px 3px 0px ${t.palette.primary.main}`,
            filter: `drop-shadow(0 0 8px ${t.palette.primary.main})`,
          },
          "&:active": {
            boxShadow: `1px 1px 0px ${t.palette.primary.main}`,
            filter: "none",
            transform: "translate(1px, 1px)",
          },
        }),
        sizeSmall: {
          padding: "5px 12px",
          fontSize: "0.6875rem",
        },
        sizeLarge: ({ theme: t }) => ({
          padding: "12px 28px",
          fontSize: "0.9375rem",
          boxShadow: `3px 3px 0px ${t.palette.primary.main}`,
          "&:hover": {
            boxShadow: `4px 4px 0px ${t.palette.primary.main}`,
            filter: `drop-shadow(0 0 12px ${t.palette.primary.main})`,
          },
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 0,
          border: `1px solid ${t.palette.divider}`,
          backgroundImage: "none",
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 0,
          border: `1px solid ${t.palette.divider}`,
          boxShadow: "none",
          transition: "border-color 0.2s ease",
          "&:hover": {
            borderColor: "rgba(0, 0, 0, 0.25)",
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "transparent",
          border: "1px solid currentColor",
          fontSize: "0.625rem",
          height: 22,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme: t }) => ({
          borderRadius: 0,
          borderRight: `1px solid ${t.palette.divider}`,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 0,
          fontSize: "0.6875rem",
        },
      },
    },
  },
});

export default theme;
