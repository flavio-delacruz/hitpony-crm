import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import PublicClientForm from "./formularioPublico";
import { formsList } from "./formsList";

const RegistroClienteForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { formName } = useParams();

  const formConfig = formsList.find((form) => form.name === formName);

  if (!formConfig) {
    return (
      <Box p={4}>
        <Typography color="error">Formulario no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        p: 2,
      }}
    >
      <PublicClientForm
        titulo={formConfig.titulo}
        subtitulo={formConfig.subtitulo}
        portada={formConfig.portada}
      />
    </Box>
  );
};

export default RegistroClienteForm;
