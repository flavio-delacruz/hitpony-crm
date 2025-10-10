import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import { PALETA } from "../../theme/paleta"; // ← RUTA CORRECTA (dos niveles)
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

/* =========================
   UI helpers (modo claro)
========================= */
const UI = {
  sky: PALETA.sky,           // #00C2FF
  cyan: PALETA.cyan,         // #0B8DB5
  purple: PALETA.purple,     // #6C4DE2
  text: PALETA.text,         // #211E26
  white: PALETA.white,       // #FFFFFF
  border: PALETA.border,     // rgba(11,141,181,.25)
  borderSoft: PALETA.borderSoft || "rgba(11,141,181,.18)",
  shadow: PALETA.shadow || "0 8px 30px rgba(33,30,38,.08)",
};

/* =========================
   Wrapper: borde degradado animado + shimmer
========================= */
const NeonWrap = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 220, damping: 20 }}
    sx={{ position: "relative", borderRadius: 20, overflow: "hidden", ...sx }}
  >
    {/* Borde gradiente */}
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        p: "1px",
        borderRadius: 20,
        background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 35%, ${UI.purple} 80%, ${UI.sky})`,
        backgroundSize: "220% 220%",
        opacity: 0.85,
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* Shimmer suave */}
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Box
        component={motion.div}
        initial={false}
        whileHover={{ x: ["-120%", "120%"] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          transform: "skewX(-20deg)",
          background:
            "linear-gradient(120deg, transparent 0, rgba(0,194,255,.12) 20%, transparent 40%)",
        }}
      />
    </Box>

    {children}
  </Box>
);

/* =========================
   Card
========================= */
const ContactoCard = ({ contacto = {}, tipo = "", onOpenCorreo = () => {} }) => {
  const bannerUrl =
    contacto.banner ||
    // fallback: degradado suave si no hay banner
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='200'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${UI.sky}' stop-opacity='0.45'/>
            <stop offset='60%' stop-color='${UI.cyan}' stop-opacity='0.45'/>
            <stop offset='100%' stop-color='${UI.purple}' stop-opacity='0.45'/>
          </linearGradient>
        </defs>
        <rect width='600' height='200' fill='url(%23g)'/>
      </svg>`
    )}`;

  const avatarUrl = contacto.avatar || null;

  return (
    <NeonWrap sx={{ background: UI.white, border: `1px solid ${UI.border}`, boxShadow: UI.shadow }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 20,
          overflow: "hidden",
          background: UI.white,
        }}
      >
        {/* Banner con overlay sutil */}
        <Box
          sx={{
            position: "relative",
            height: 150,
            width: "100%",
            backgroundColor: "#f5f5f5",
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,.00) 40%, rgba(255,255,255,.85) 100%)",
            }}
          />
        </Box>

        {/* Avatar con ring degradado */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: -40,
              left: 18,
              p: "2px",
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 50%, ${UI.purple})`,
              boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: UI.white,
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Foto de perfil de ${contacto.nombre || ""}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <PersonIcon sx={{ fontSize: 46, color: "rgba(33,30,38,.45)" }} />
              )}
            </Box>
          </Box>

          <CardContent sx={{ pt: 4.5, pl: 18, pr: 2, pb: 2 }}>
            {/* Nombre */}
            <Typography
              variant="h6"
              sx={{
                mt: 0.5,
                fontFamily:
                  "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
                fontWeight: 900,
                color: UI.text,
                lineHeight: 1.15,
              }}
            >
              {(contacto.nombre || "").trim()} {(contacto.apellido || "").trim()}
            </Typography>

            {/* Tipo + botón correo */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.25, gap: 1 }}>
              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: ".02em",
                  color: UI.text,
                  background:
                    "linear-gradient(90deg, rgba(0,194,255,.15), rgba(108,77,226,.15))",
                  border: `1px solid ${UI.borderSoft}`,
                }}
              >
                {tipo || "Contacto"}
              </Box>

              <IconButton
                aria-label="contactar por correo"
                onClick={() => onOpenCorreo(contacto.id)}
                sx={{
                  ml: 0.5,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  color: UI.white,
                  background: `linear-gradient(90deg, ${UI.cyan}, ${UI.purple})`,
                  boxShadow: "0 8px 18px rgba(0,0,0,.18)",
                  "&:hover": {
                    filter: "brightness(1.05)",
                    boxShadow: "0 10px 22px rgba(0,0,0,.22)",
                  },
                }}
              >
                <MailOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Datos */}
            <Typography
              variant="body2"
              sx={{
                mt: 1.1,
                color: "rgba(33,30,38,.8)",
                wordBreak: "break-word",
                fontWeight: 600,
              }}
            >
              Correo: {contacto.correo || "—"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 0.25, color: "rgba(33,30,38,.8)", fontWeight: 600 }}
            >
              Teléfono: {contacto.telefono || "—"}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </NeonWrap>
  );
};

export default ContactoCard;
