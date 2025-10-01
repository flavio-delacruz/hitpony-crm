// src/theme.js
import { createTheme } from "@mui/material/styles";

// Tokens de marca (ajusta si Dennis cambia algo)
export const brand = {
  blue:   "#0B8DB5", // azul Dennis
  purple: "#6C4DE2", // morado Dennis
  cyan:   "#00EAF0", // acento turquesa
  pink:   "#FF2D75", // acento rosa
  bg:     "#0f1016",
  card:   "#171923",
  text:   "#e7e9ee",
  text2:  "#aab0c0",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary:   { main: brand.blue },
    secondary: { main: brand.purple },
    background:{ default: brand.bg, paper: brand.card },
    text:      { primary: brand.text, secondary: brand.text2 },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      "'Poppins','Inter',system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,'Apple Color Emoji','Segoe UI Emoji'",
  },
});

export default theme;
