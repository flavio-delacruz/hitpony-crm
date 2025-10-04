import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";

/* =========================
    Paleta Neón (Coherente)
========================= */
const UI_NEON = {
  cyan: "#00EAF0",
  pink: "#FF2D75",
  purple: "#6C4DE2",
  bgDark: "#121522", // Fondo del modal
  text: "#E8ECF1",
};

/* =========================
    Contenedor del Modal con Estilo Neón
========================= */
const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350, // Aumentamos un poco el ancho
  backgroundColor: UI_NEON.bgDark,
  borderRadius: "14px", // Más redondeado
  padding: 32,
  textAlign: "center",
  color: UI_NEON.text,
  // Sombra y Glow neón
  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.9), 0 0 15px ${UI_NEON.cyan}33`,
  border: `1px solid ${UI_NEON.purple}33`,
}));

/* =========================
    Botón Neón Primario (Salir)
========================= */
const NeonConfirmButton = styled(Button)({
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '8px 16px',
    borderRadius: 8,
    color: UI_NEON.bgDark, // Texto oscuro en fondo brillante
    background: `linear-gradient(90deg, ${UI_NEON.pink} 0%, ${UI_NEON.pink} 100%)`,
    boxShadow: `0 0 10px ${UI_NEON.pink}99`,
    '&:hover': {
        background: `linear-gradient(90deg, ${UI_NEON.pink} 0%, ${UI_NEON.pink} 100%)`,
        boxShadow: `0 0 15px ${UI_NEON.pink}cc`,
        transform: 'scale(1.03)',
        transition: 'all 0.2s ease',
    },
});

/* =========================
    Botón Neón Outline (Cancelar)
========================= */
const NeonCancelButton = styled(Button)({
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '8px 16px',
    borderRadius: 8,
    color: UI_NEON.text,
    // Borde neón con color cian
    border: `1px solid ${UI_NEON.cyan}`,
    '&:hover': {
        color: UI_NEON.cyan,
        backgroundColor: `${UI_NEON.cyan}10`, // Fondo sutil al hacer hover
        boxShadow: `0 0 10px ${UI_NEON.cyan}55`,
        transform: 'scale(1.03)',
        transition: 'all 0.2s ease',
        border: `1px solid ${UI_NEON.cyan}`, // Mantener el borde
    },
});


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
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition // Permite usar la transición de framer-motion en el contenido
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <ModalBox>
          <Typography
            id="modal-title"
            variant="h5" // Hacemos el título más grande
            component="h2"
            mb={1}
            sx={{ 
                color: UI_NEON.text,
                textShadow: `0 0 8px ${UI_NEON.cyan}33`,
                letterSpacing: '0.05em'
            }}
          >
            CONFIRMACIÓN
          </Typography>
          
          <Typography
            id="modal-description"
            variant="body1"
            mb={3}
            sx={{ color: UI_NEON.text, opacity: 0.8 }}
          >
            Estás a punto de cerrar tu sesión. ¿Deseas continuar?
          </Typography>
          
          <Box
            display="flex"
            justifyContent="space-between"
            gap={2}
          >
            {/* Botón Cancelar (Outline Neón Cian) */}
            <NeonCancelButton
              onClick={handleClose}
              fullWidth
            >
              Cancelar
            </NeonCancelButton>
            
            {/* Botón Salir (Contained Neón Pink) */}
            <NeonConfirmButton
              onClick={handleConfirmLogout}
              fullWidth
            >
              Salir
            </NeonConfirmButton>
          </Box>
        </ModalBox>
      </motion.div>
    </Modal>
  );
};

export default LogoutModal;