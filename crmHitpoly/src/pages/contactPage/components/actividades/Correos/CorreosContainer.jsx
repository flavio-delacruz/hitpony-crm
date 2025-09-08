import React, { useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material"; // Importa Divider
// Importa el componente CorreoFlotante. La ruta debe ser correcta.
import CorreoFlotante from "../../../../../components/correos/enviados/CorreoFlotante";

export default function CorreosContainer({ prospectoId }) {
  // 1. Añade un estado para controlar la visibilidad del componente de correo
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // 2. Funciones para abrir y cerrar el componente flotante
  const handleOpenEmail = () => setIsEmailModalOpen(true);
  const handleCloseEmail = () => setIsEmailModalOpen(false);

  return (
    <Box sx={{}}>
      {/* 3. Contenedor para el título y el botón */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        {/* 4. El botón para crear un nuevo correo */}
        <Button 
          variant="contained" 
          onClick={handleOpenEmail}
        >
          Crear Correo
        </Button>
      </Box>

      {/* Agrega el Divider aquí para que aparezca después del botón */}
      <Divider sx={{ mt: 1, mb: 2 }} />

      {/* 5. Se llama directamente a CorreoFlotante sin usar el componente Modal de Material-UI */}
      <CorreoFlotante
        open={isEmailModalOpen}
        onClose={handleCloseEmail}
        prospectoId={prospectoId}
      />
    </Box>
  );
}