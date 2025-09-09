import React, { useState } from "react";
import { Box, Divider } from "@mui/material"; // Importa Divider
import CorreoFlotante from "../../../../../components/correos/enviados/CorreoFlotante";

export default function CorreosContainer({ prospectoId }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

 const handleOpenEmail = () => setIsEmailModalOpen(true);
  const handleCloseEmail = () => setIsEmailModalOpen(false);

  return (
    <Box sx={{}}>


      <Divider sx={{ mt: 1, mb: 2 }} />

      <CorreoFlotante
        open={isEmailModalOpen}
        onClose={handleCloseEmail}
        prospectoId={prospectoId}
      />
    </Box>
  );
}