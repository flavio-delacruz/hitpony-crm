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
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

/* Colores corporativos */
const colors = {
  cyan: "#00C2FF",
  violet: "#3B207F",
  pink: "#00C2FF",
  blue: "#0B8DB5",
  text: "#0F172A",
  bg: "#ffffff",
  border: "#00C2FF",
};

/* Botón contorneado tipo "neon outline" */
const NeonOutline = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingInline: 18,
  paddingBlock: 8,
  fontWeight: 700,
  fontSize: "1rem",
  letterSpacing: ".03em",
  textTransform: "none",
  color: colors.text,
  border: `2px solid ${colors.cyan}`,
  background: "transparent",
  transition: "all 0.22s ease",
  "&:hover": {
    background: `linear-gradient(90deg, ${colors.cyan}, ${colors.blue} 55%, ${colors.pink})`,
    color: "#fff",
    transform: "translateY(-1px)",
    boxShadow: `0 6px 18px ${alpha(colors.violet, 0.18)}`,
  },
}));

const LoginNavbar = ({
  logoSrc = "/logoHitpoly.svg",
  notifications = 0,
  user = { name: "Invitado", avatar: "" },
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    "Servicio",
    "Contáctanos",
    "Soporte",
    "Nuestro Equipo",
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          background: colors.bg,
          color: colors.text,
          height: { xs: 72, md: 80 },
          justifyContent: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        <Toolbar
          sx={{
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {/* Logo a la izquierda */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: colors.violet,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: ".04em",
              }}
            >
              Formark CRM
            </Typography>
          </Box>

          {/* Empuja todo al extremo derecho */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botones visibles solo en pantallas medianas y grandes */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <NeonOutline
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<SupportAgentRoundedIcon />}
              aria-haspopup="true"
              aria-controls={anchorEl ? "servicio-menu" : undefined}
            >
              Servicio
            </NeonOutline>

            <NeonOutline>Contáctanos</NeonOutline>
            <NeonOutline>Soporte</NeonOutline>
            <NeonOutline>Nuestro Equipo</NeonOutline>

            <Tooltip title="Notificaciones">
              <IconButton sx={{ color: colors.text }}>
                <Badge color="error" badgeContent={notifications}>
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={user.name}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  border: `2px solid ${colors.cyan}`,
                }}
              />
            </Tooltip>
          </Stack>

          {/* Ícono hamburguesa solo visible en móviles */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: colors.text,
            }}
            onClick={toggleDrawer(true)}
          >
            <MenuRoundedIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menú lateral (Drawer) para móviles */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 260,
            p: 2,
            bgcolor: colors.bg,
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.blue,
              mb: 2,
              textAlign: "center",
            }}
          >
            Menú
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={toggleDrawer(false)}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: colors.text,
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "center" }}>
            <Tooltip title="Notificaciones">
              <IconButton sx={{ color: colors.text }}>
                <Badge color="error" badgeContent={notifications}>
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={user.name}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{
                  width: 48,
                  height: 48,
                  mt: 2,
                  border: `2px solid ${colors.cyan}`,
                  mx: "auto",
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      {/* Menú de Servicio (versión desktop) */}
      <Menu
        id="servicio-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Nuestro Equipo</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          FAQ / Preguntas Frecuentes
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Ayuda</MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>Soporte</MenuItem>
      </Menu>
    </>
  );
};

export default LoginNavbar;


