import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Stack,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Badge,
  useTheme,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

/* ===== Paleta neón coherente con tus pantallas ===== */
const useUI = (mode) => ({
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  purple: "#6C4DE2",
  pink: "#FF2D75",
  text: mode === "dark" ? "#E8ECF1" : "#0F172A",
  barBg:
    mode === "dark"
      ? `linear-gradient(90deg, rgba(0,234,240,.10), rgba(108,77,226,.10) 55%, rgba(255,45,117,.10)), rgba(11,15,20,.85)`
      : "#ffffff",
  border: mode === "dark" ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.10)",
});

/* Botón contorneado con borde neón */
const NeonOutline = styled(Button)(({ theme }) => {
  const ui = useUI(theme.palette.mode);
  return {
    borderRadius: 999,
    paddingInline: 16,
    fontWeight: 800,
    letterSpacing: ".02em",
    color: ui.text,
    textTransform: "none",
    border: "1px solid transparent",
    background: `
      linear-gradient(${theme.palette.mode === "dark" ? "rgba(13,16,23,.75)" : "#fff"}, ${theme.palette.mode === "dark" ? "rgba(13,16,23,.75)" : "#fff"}) padding-box,
      linear-gradient(90deg, ${ui.cyan}, ${ui.blue} 55%, ${ui.pink}) border-box`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 18px rgba(0,0,0,.35)"
        : "0 6px 14px rgba(0,0,0,.08)",
    "&:hover": {
      color: ui.pink,
      filter: "brightness(1.05)",
      background: `
        linear-gradient(${alpha(theme.palette.background.paper, 0.9)}, ${alpha(
        theme.palette.background.paper,
        0.9
      )}) padding-box,
        linear-gradient(90deg, ${ui.cyan}, ${ui.blue} 55%, ${ui.pink}) border-box`,
    },
  };
});

const LoginNavbar = ({
  logoSrc = "/logoHitpoly.svg",
  onToggleTheme,
  mode = "dark",
  notifications = 0,
  user = { name: "Invitado", avatar: "" },
}) => {
  const theme = useTheme();
  const ui = useUI(theme.palette.mode);
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: ui.barBg,
          borderBottom: `1px solid ${ui.border}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ minHeight: 64, gap: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: ui.text,
              mr: 1,
            }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt="Logo"
              sx={{ height: 34, width: "auto", display: "block" }}
            />
          </Box>

          {/* Nav simple para Login */}
          <Stack direction="row" spacing={1}>
            <NeonOutline onClick={(e) => setAnchor(e.currentTarget)} endIcon={<SupportAgentRoundedIcon />}>
              Soporte
            </NeonOutline>
            <NeonOutline>Atención</NeonOutline>
            <NeonOutline>Desarrolladores</NeonOutline>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Acciones derecha */}
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Tooltip title="Notificaciones">
              <IconButton sx={{ color: ui.text }}>
                <Badge color="error" badgeContent={notifications}>
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={mode === "dark" ? "Fondo claro" : "Fondo oscuro"}>
              <IconButton onClick={onToggleTheme} sx={{ color: ui.text }}>
                {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={user.name}>
              <Avatar alt={user.name} src={user.avatar} sx={{ width: 34, height: 34 }} />
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú Soporte */}
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => setAnchor(null)}>Dudas</MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>Comentarios & Sugerencias</MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>Ayuda</MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchor(null)}>Soporte con Desarrolladores</MenuItem>
      </Menu>
    </>
  );
};

export default LoginNavbar;
