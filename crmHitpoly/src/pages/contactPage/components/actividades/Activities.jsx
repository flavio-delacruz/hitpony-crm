// Activities.jsx
import { Box, Tabs, Tab, Divider } from "@mui/material";
import { useState, useEffect } from "react";

export default function Activities({
  onEmailClick,
  onNoteClick,
  onCallClick,
  onWhatsAppClick,
  prospectId,
}) {
  const [tabValue, setTabValue] = useState("email");

  useEffect(() => {}, [tabValue]);

  useEffect(() => {}, [prospectId]);

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
      case "cita":
        break;
      case "reunion":
        break;
      case "tarea":
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="scrollable tabs"
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: "flex-start",
          },
        }}
      >
        <Tab label="Correos" value="email" />
        <Tab label="Notas" value="nota" />
        <Tab label="Tarea" value="tarea" />
        <Tab label="Reunión" value="reunion" />
      </Tabs>

      <Divider sx={{ mt: 1, mb: 2 }} />
    </Box>
  );
}
