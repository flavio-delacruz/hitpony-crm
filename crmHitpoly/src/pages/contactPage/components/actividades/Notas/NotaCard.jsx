// src/components/NotaCard.js

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Box,
  Typography,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../../../context/AuthContext";

const API_BASE_URL = "https://apiweb.hitpoly.com/ajax/";

export default function NotaCard({
  initialNote,
  prospectoId,
  onNoteDeleted,
  onNoteCreated,
  onNoteEdited,
  onCancel,
}) {
  const { user } = useAuth();
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const isExistingNote = note.id !== null;
  const [expanded, setExpanded] = useState(false);
  const [creadorNombre, setCreadorNombre] = useState("Cargando...");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const esCreador = user && initialNote && user.id === initialNote.usuario_id;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const fetchCreadorNombre = async (userId) => {
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "getDataUsuarios",
            id: userId,
          }),
        }
      );
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const prospecto = data.data[0];
        if (prospecto && prospecto.nombre) {
          return `${prospecto.nombre} ${prospecto.apellido || ""}`.trim();
        }
      }
    } catch (error) {}
    return "Usuario desconocido";
  };

  useEffect(() => {
    setNote(initialNote);
    if (initialNote && initialNote.usuario_id) {
      fetchCreadorNombre(initialNote.usuario_id).then((name) => {
        setCreadorNombre(name);
      });
    }
  }, [initialNote]);

  const handleCreateOrUpdateNote = async () => {
    if (
      !user ||
      !prospectoId ||
      (!note.titulo.trim() && !note.contenido.trim())
    ) {
      return;
    }

    setIsSaving(true);
    try {
      let url, body;
      if (isExistingNote) {
        url = `${API_BASE_URL}editarNotasController.php`;
        body = {
          accion: "editarNotas",
          id: note.id,
          usuario_id: user.id,
          prospecto_id: prospectoId,
          titulo: note.titulo,
          contenido: note.contenido,
        };
      } else {
        url = `${API_BASE_URL}crearNotasController.php`;
        body = {
          accion: "cargarNotas",
          usuario_id: user.id,
          prospecto_id: prospectoId,
          titulo: note.titulo,
          contenido: note.contenido,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === true) {
        // ✅ REGISTRO DE ACTIVIDAD: se ejecuta después de que la nota se guardó con éxito.
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDateTime = new Date();
        const year = localDateTime.getFullYear();
        const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(localDateTime.getDate()).padStart(2, '0');
        const hours = String(localDateTime.getHours()).padStart(2, '0');
        const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
        const seconds = String(localDateTime.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const actividadData = {
          funcion: "registrarActividad",
          prospecto_id: prospectoId,
          tipo_actividad: "nota",
          detalle_actividad: `Se creó una nota: "${note.titulo}"`,
          fecha_hora: formattedDateTime,
          zona_horaria: timeZone,
          estado_anterior: "Sin estado",  
          estado_nuevo: "Nota registrada",
          canal: "Notas",
        };

        try {
          const registerResponse = await fetch('https://apiweb.hitpoly.com/ajax/registerActividadController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actividadData),
          });
          const registerData = await registerResponse.json();
          if (registerData.status === "success") {
            console.log("Actividad de nota registrada con éxito.");
          } else {
            console.error("Error al registrar la actividad de nota:", registerData);
          }
        } catch (registerError) {
          console.error("Error en la petición para registrar la actividad de nota:", registerError);
        }
        onNoteCreated();
      }
    } catch (error) {
      // Manejo de errores sin alerta visual
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    handleCloseDeleteDialog();
    try {
      const response = await fetch(
        `${API_BASE_URL}deleteNotasController.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "BorrarNota",
            id: note.id,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success" || data.success === true) {
        onNoteDeleted(note.id);
      }
    } catch (error) {
      // Manejo de errores sin alerta visual
    }
  };

  const handleEditClick = () => {
    if (onNoteEdited) {
      onNoteEdited(note);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const getDisplayDateTime = (serverDateString) => {
    if (!serverDateString) {
      return "";
    }
    const serverDate = new Date(serverDateString);
    const peruTimeInMillis = serverDate.getTime() + 60 * 60 * 1000;
    const peruDate = new Date(peruTimeInMillis);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: userTimeZone,
      timeZoneName: 'short'
    };
    return peruDate.toLocaleString(navigator.language, options);
  };

  // Vista de edición para el modal
  if (onCancel) {
    return (
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {isExistingNote ? "Editando nota" : "Creando nota"}
        </Typography>
        <TextField
          fullWidth
          label="Título"
          name="titulo"
          value={note.titulo}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contenido"
          name="contenido"
          multiline
          rows={4}
          value={note.contenido}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrUpdateNote}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Aceptar"}
          </Button>
        </Box>
      </Card>
    );
  }

  // Vista de tarjeta estática para la lista principal
  return (
    <Card
      variant="outlined"
      sx={{ p: 2, display: "flex", flexDirection: "column", cursor: "pointer" }}
    >
      <CardContent sx={{ flexGrow: 1, p: 0, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton
            onClick={handleExpandClick}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
              p: "4px",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
          <Typography variant="body1" fontWeight="bold">
            Por {creadorNombre}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {getDisplayDateTime(note.created_at)}
          </Typography>
        </Box>

        <Typography
          component="h3"
          sx={{ ml: "32px", mb: 1, fontSize: "1rem" }}
        >
          {note.titulo}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "pre-wrap", ml: "32px" }}
        >
          {note.contenido || "Escribe tu nota aquí..."}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {esCreador && (
            <Box sx={{ mt: 2, ml: "32px", display: "flex", gap: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleEditClick}
              >
                Editar nota
              </Typography>
              <Typography
                variant="body2"
                color="error"
                sx={{ cursor: "pointer" }}
                onClick={handleOpenDeleteDialog}
              >
                Eliminar nota
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>

      {/* Modal de confirmación para eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Estás seguro?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¡No podrás revertir esto! La nota se eliminará permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteNote} color="error" autoFocus>
            Sí, borrarla
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}