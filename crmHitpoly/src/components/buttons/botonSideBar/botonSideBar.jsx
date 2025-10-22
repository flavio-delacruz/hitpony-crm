import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

// Colores unificados
const SKY_BLUE = "#4FC3F7";
const DEEP_VIOLET = "#5E35B1"; // Color principal para hover y fondo de selección
const TEXT_COLOR = "#fff";

// Filtramos props custom para que no vayan al DOM
const ButtonWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isselected" &&
    prop !== "isexpanded" &&
    prop !== "islogout" &&
    prop !== "dense",
})(({ isselected, dense }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: TEXT_COLOR,
  // Ajuste de padding: lo hacemos consistente pero adaptable
  padding: dense ? "8px 12px" : "12px 16px",
  cursor: "pointer",
  margin: "4px 0",
  // Fondo de selección/hover consistente
  backgroundColor: isselected ? DEEP_VIOLET : "transparent",
  borderRadius: 8,
  transition: "background-color .2s ease, transform .1s ease",
  "&:hover": {
    backgroundColor: DEEP_VIOLET,
    transform: 'translateY(-1px)', // Ligero efecto 3D al hacer hover
  },
  minHeight: dense ? 36 : 44,
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isselected" && prop !== "dense",
})(({ isselected, dense }) => ({
  minWidth: dense ? 28 : 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // El icono toma el color azul cielo cuando está seleccionado
  color: isselected ? SKY_BLUE : TEXT_COLOR,
  transition: "color .2s ease",
}));

const TextStyled = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "dense",
})(({ dense }) => ({
  fontFamily: "Montserrat, sans-serif",
  fontSize: dense ? 14 : 16,
  fontWeight: 500,
  whiteSpace: "nowrap",
  marginLeft: dense ? 10 : 12,
  overflow: "hidden",
}));

/**
 * BotonSideBar (Versión Genérica)
 * Utilizable dentro de cualquier panel o lista.
 * @param {boolean} dense - Para un estilo más compacto.
 */
const BotonSideBar = ({
  text,
  Icon,
  to,
  isSelected = false,
  onClick,
  isExpanded = true, // Siempre asumimos que el texto debe mostrarse si se usa fuera de un rail
  isLogout = false,
  dense = false,
}) => {
  const content = (
    <ButtonWrapper
      isselected={isSelected ? 1 : 0}
      isexpanded={isExpanded ? 1 : 0}
      islogout={isLogout ? 1 : 0}
      onClick={onClick}
      dense={dense ? 1 : 0}
      role="button"
      aria-label={text}
    >
      <IconBox isselected={isSelected ? 1 : 0} dense={dense ? 1 : 0}>
        {Icon && <Icon sx={{ fontSize: dense ? 20 : 22 }} />}
      </IconBox>
      {/* Mantenemos isExpanded por compatibilidad, pero siempre se muestra el texto */}
      {isExpanded && <TextStyled dense={dense ? 1 : 0}>{text}</TextStyled>}
    </ButtonWrapper>
  );

  // Lógica de Link para navegación
  if (to && !isLogout) {
    return (
      <Link
        to={to}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        {content}
      </Link>
    );
  }
  return content;
};

export default BotonSideBar;