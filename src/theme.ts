"use client";

import { createTheme } from "@mui/material/styles";

export const verde = "#2E7D32";
export const verdeClaro = "#4CAF50";
export const verdeOscuro = "#1B5E20";
export const verdePastel = "#E8F5E9";
export const verdeSuave = "#C8E6C9";
export const grisFondo = "#F8FAFC";
export const grisBorde = "#E2E8F0";
export const grisTexto = "#1E293B";
export const grisSecundario = "#64748B";

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
    secondary: {
      main: verdeOscuro,
      light: verdePastel,
      dark: "#0E3812",
      contrastText: "#FFFFFF",
    },
    background: {
      default: grisFondo,
      paper: "#FFFFFF",
    },
    text: {
      primary: grisTexto,
      secondary: grisSecundario,
    },
    divider: grisBorde,
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    h1: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", color: grisTexto },
    h2: { fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em", color: grisTexto },
    h3: { fontSize: "1rem", fontWeight: 600, color: grisTexto },
    body1: { fontSize: "0.875rem", lineHeight: 1.5, color: grisTexto },
    body2: { fontSize: "0.8125rem", lineHeight: 1.5, color: grisSecundario },
    caption: { fontSize: "0.75rem", letterSpacing: "0.02em", color: grisSecundario },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 18px",
          fontSize: "0.8125rem",
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          backgroundColor: verde,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: verdeOscuro,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.25)",
          },
        },
        outlined: {
          borderColor: grisBorde,
          color: verde,
          "&:hover": {
            borderColor: verde,
            backgroundColor: verdePastel,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${grisBorde}`,
          boxShadow: "0 2px 14px 0 rgba(32, 40, 45, 0.05)",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            borderColor: "#CBD5E1",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: grisBorde,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: verdeClaro,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: verde,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${grisBorde}`,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "3px 0",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: verdePastel,
          },
          "&.Mui-selected": {
            backgroundColor: verdePastel,
            color: verdeOscuro,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: verdePastel,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
          backgroundColor: verde,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          "&.Mui-selected": {
            color: verde,
          },
        },
      },
    },
  },
});

export default theme;
