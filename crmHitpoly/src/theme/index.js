import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { PALETA } from "./paleta";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary:   { main: PALETA.sky },     // Azul Cielo como primario
    secondary: { main: PALETA.purple },  // Violeta como secundario
    background: {
      default: PALETA.night,
      paper:   PALETA.night,
    },
    text: {
      primary: PALETA.text,
      secondary: "rgba(236,234,239,.82)",
    },
    divider: PALETA.borderSoft,
  },

  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
    h1: { fontWeight: 900, color: PALETA.text },
    h2: { fontWeight: 800, color: PALETA.text },
    h3: { fontWeight: 700, color: PALETA.text },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: PALETA.night,
          color: PALETA.text,
        },
        "*::-webkit-scrollbar-thumb": {
          background: PALETA.purple,
          borderRadius: 8,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: PALETA.night,
          backgroundImage: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderRadius: 14,
          border: `1px solid ${PALETA.border}`,
          boxShadow: PALETA.shadow,
          overflow: "hidden",
          transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: PALETA.shadowSoft,
            borderColor: PALETA.sky,
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: PALETA.borderSoft },
      },
    },

    MuiTypography: {
      styleOverrides: { root: { color: PALETA.text } },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          background: PALETA.gradEdge,
          "&:hover": {
            filter: "saturate(115%)",
            boxShadow: `0 0 16px ${PALETA.glow}`,
          },
        },
        outlinedPrimary: {
          borderColor: PALETA.sky,
          color: PALETA.sky,
          "&:hover": { borderColor: PALETA.purple, color: PALETA.purple },
        },
      },
    },
  },
});

export const AppTheme = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
