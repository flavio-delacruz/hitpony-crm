import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";

const ContactoCard = ({ contacto, tipo, onOpenCorreo }) => {
  return (
    <Card raised>
      <Box
        sx={{
          position: "relative",
          height: 150,
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${contacto.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      />
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: -5,
            ml: 2,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "4px solid white",
            backgroundColor: "grey.300",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {contacto.avatar ? (
            <img
              src={contacto.avatar}
              alt={`Foto de perfil de ${contacto.nombre}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <PersonIcon sx={{ fontSize: 60, color: "grey.600" }} />
          )}
        </Box>
        <CardContent sx={{ ml: 2, position: "relative" }}>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {contacto.nombre} {contacto.apellido}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ mr: 1 }}>
              {tipo}
            </Typography>
            <IconButton
              aria-label="contactar por correo"
              onClick={() => onOpenCorreo(contacto.id)}
              sx={{
                color: "primary.main",
                p: 0.5,
              }}
            >
              <MailOutlineIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, overflowWrap: "break-word" }}>
            Correo: {contacto.correo}
          </Typography>
          <Typography variant="body2">Teléfono: {contacto.telefono}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ContactoCard;