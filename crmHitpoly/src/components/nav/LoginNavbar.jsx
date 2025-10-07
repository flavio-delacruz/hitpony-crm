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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
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
    display: { xs: "none", md: "block" }, // opcional: ocultar texto en móviles
    }}
    >
    Formark CRM </Typography> </Box>

          {/* Empuja todo al extremo derecho */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Elementos al extremo derecho */}
          <Stack direction="row" spacing={2} alignItems="center">
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
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  border: `2px solid ${colors.cyan}`,
                }}
              />
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú de Servicio */}
      <Menu
        id="servicio-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Nuestro Equipo</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>FAQ / Preguntas Frecuentes</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Ayuda</MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>Soporte</MenuItem>
      </Menu>
    </>

  );
};

export default LoginNavbar;
