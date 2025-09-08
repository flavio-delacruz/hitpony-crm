import { Box, Tabs, Tab, Divider } from "@mui/material";
import { useState } from "react";

export default function Activities({ onEmailClick, onNoteClick, onCallClick, onWhatsAppClick }) {
  
  // Cambia el valor inicial de 'nota' a 'email'
  const [tabValue, setTabValue] = useState("email");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    switch (newValue) {
      case "email":
        if (onEmailClick) {
          onEmailClick();
        }
        break;
      case "nota":
        if (onNoteClick) {
          onNoteClick();
        }
        break;
      case "telefono":
        if (onCallClick) {
          onCallClick();
        }
        break;
      case "whatsapp":
        if (onWhatsAppClick) {
          onWhatsAppClick();
        }
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Correos" value="email" />
        <Tab label="Llamadas" value="telefono" />
        <Tab label="WhatsApp" value="whatsapp" />
        <Tab label="Notas" value="nota" />
      </Tabs>
      <Divider sx={{ mt: 1, mb: 2 }} />
    </Box>
  );
}