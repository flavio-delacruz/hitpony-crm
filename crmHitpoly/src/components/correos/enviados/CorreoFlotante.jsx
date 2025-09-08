// src/components/CorreoFlotante.js

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const style = {
  position: 'fixed',
  bottom: { xs: 16, sm: 0 },
  right: { xs: 8, sm: 20 }, 
  width: { xs: 'calc(100% - 16px)', sm: 400 },
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: { xs: '8px', sm: '8px 8px 0 0' }, 
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function CorreoFlotante({ open, onClose, prospectoId }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const defaultSenderEmail = "correo_por_defecto@example.com";

  useEffect(() => {    
    const fetchProspectData = async () => {
      if (user?.id && prospectoId) {
        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/traerProsxIdController.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accion: "getProspecto",
                id: prospectoId,
              }),
            }
          );
          const data = await response.json();

          if (data.success && data.resultado && data.resultado.correo) {
            setRecipientEmails([data.resultado.correo]);
          } else {
            Swal.fire("Advertencia", "No se encontró correo para el prospecto seleccionado.", "warning");
            setRecipientEmails([]);
          }
        } catch (error) {
          Swal.fire("Error", "Error al obtener los datos del prospecto.", "error");
        }
      } else {
        setRecipientEmails([]);
      }
    };

    if (open) {
      fetchProspectData();
    }
  }, [user?.id, prospectoId, open]);

  const handleEnviarCorreo = async () => {
    if (recipientEmails.length === 0) {
      Swal.fire("Advertencia", "No hay un correo destinatario.", "warning");
      return;
    }

    if (!subject.trim() || !body.trim()) {
      Swal.fire("Advertencia", "Por favor, complete el asunto y el cuerpo del correo.", "warning");
      return;
    }

    setIsSending(true);

    try {
      const senderEmail = user?.correo || defaultSenderEmail;
      const requestBody = JSON.stringify({
        accion: "emails",
        name: user?.nombre || "",
        email: senderEmail,
        destinatarios: recipientEmails,
        motivo: subject,
        message: body,
      });

      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/mandarEmailsController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      const data = await response.json();

      if (data.status === "success" || data.status === "completed") {
        Swal.fire("Éxito", "El correo ha sido enviado correctamente.", "success");
        setSubject("");
        setBody("");
        onClose(); 
      } else {
        Swal.fire("Error", data.message || "Hubo un problema al enviar el correo.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo.", "error");
    } finally {
      setIsSending(false);
    }
  };

  if (!open) return null;

  return (
    <Box sx={style}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Mensaje nuevo</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {recipientEmails.length > 0 && (
        <TextField
          label="Destinatario"
          value={recipientEmails.join(', ')}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      )}
      
      <TextField
        label="Asunto"
        fullWidth
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      
      <TextField
        label="Cuerpo del Correo"
        multiline
        rows={4}
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleEnviarCorreo}
        disabled={isSending}
        startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isSending ? "Enviando..." : "Enviar"}
      </Button>
    </Box>
  );
}