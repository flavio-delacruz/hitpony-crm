import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { PALETA } from "../../../theme/paleta"; // ← ajusta si tu ruta es distinta

// Tipografía (mismo estilo que Dashboard/CRM/Listas)
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

/* =========================
   Contenedores estilizados
========================= */

// Tarjeta base del modal (ovalada, fondo blanco, borde suave)
const ModalCard = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  maxWidth: "92vw",
  borderRadius: 18,
  background: PALETA.white,
  color: PALETA.text,
  border: `1px solid ${PALETA.border}`,
  boxShadow: PALETA.shadow,
  overflow: "hidden",
});

// Borde degradado animado
const AnimatedBorder = styled(Box)({
  position: "absolute",
  inset: 0,
  borderRadius: 18,
  padding: "1px",
  background: `linear-gradient(120deg, ${PALETA.sky}, ${PALETA.cyan} 35%, ${PALETA.purple} 80%, ${PALETA.sky})`,
  backgroundSize: "220% 220%",
  opacity: 0.85,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  pointerEvents: "none",
});

// Shimmer sutil
const Shimmer = styled(Box)({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

// Contenido
const Content = styled(Box)({
  position: "relative",
  zIndex: 1,
  padding: 24,
});

// Botón gradiente (acción principal)
const ContainedGradButton = styled(Button)({
  borderRadius: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  padding: "10px 16px",
  color: "#FFFFFF",
  background: `linear-gradient(90deg, ${PALETA.sky} 0%, ${PALETA.cyan} 45%, ${PALETA.purple} 100%)`,
  boxShadow: "0 10px 24px rgba(0,0,0,.20)",
  "&:hover": {
    filter: "brightness(1.06)",
    boxShadow: "0 14px 34px rgba(0,0,0,.28)",
  },
});

// Botón outline con borde en gradiente
const OutlinedGradButton = styled(Button)({
  borderRadius: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  padding: "10px 16px",
  color: PALETA.text,
  border: "1px solid transparent",
  background: `
    linear-gradient(${PALETA.white}, ${PALETA.white}) padding-box,
    linear-gradient(90deg, ${PALETA.sky}, ${PALETA.purple}) border-box`,
  "&:hover": {
    color: PALETA.purple,
    background: `
      linear-gradient(rgba(255,255,255,.92), rgba(255,255,255,.92)) padding-box,
      linear-gradient(90deg, ${PALETA.sky}, ${PALETA.purple}) border-box`,
  },
});

/* =========================
   Componente
========================= */
const LogoutModal = ({ open, handleClose }) => {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      BackdropProps={{
        sx: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(33,30,38,.25)",
        },
      }}
      closeAfterTransition
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <ModalCard>
          {/* Borde animado */}
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <AnimatedBorder />
          </motion.div>

          {/* Shimmer */}
          <Shimmer>
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
          </Shimmer>

          {/* Contenido */}
          <Content>
            {/* Título Montserrat 900 con degradado */}
            <Typography
              id="logout-title"
              component="div"
              sx={{
                fontFamily:
                  "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: ".02em",
                lineHeight: 1.05,
                fontSize: 28,
                mb: 1,
              }}
            >
              {"Confirmación".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.02,
                    type: "spring",
                    stiffness: 240,
                    damping: 18,
                  }}
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow:
                      "0 0 10px rgba(108,77,226,.18), 0 0 12px rgba(11,141,181,.16)",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </Typography>

            <Typography
              id="logout-desc"
              variant="body1"
              sx={{ color: PALETA.text, opacity: 0.85, mb: 2.5 }}
            >
              Estás a punto de cerrar tu sesión. ¿Deseas continuar?
            </Typography>

            <Box display="flex" gap={1.5}>
              <OutlinedGradButton onClick={handleClose} fullWidth>
                Cancelar
              </OutlinedGradButton>
              <ContainedGradButton onClick={handleConfirmLogout} fullWidth>
                Salir
              </ContainedGradButton>
            </Box>
          </Content>
        </ModalCard>
      </motion.div>
    </Modal>
  );
};

export default LogoutModal;
