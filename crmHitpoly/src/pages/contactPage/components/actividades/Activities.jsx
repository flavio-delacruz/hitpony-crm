// ActivityCreator.jsx
import { Box, IconButton, Modal, Typography, TextField, Button } from "@mui/material";
import { Email, Call, WhatsApp, NoteAdd } from "@mui/icons-material";
import { useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function Activities() {
  const [open, setOpen] = useState(false);
  const [actividad, setActividad] = useState({
    prospecto_id: 1,
    tipo_actividad: '',
    detalle_actividad: '',
    fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' '),
    estado_anterior: "en_proceso",
    estado_nuevo: '',
    canal: '',
  });

  const handleOpen = (tipo, canal) => {
    setActividad((prevActividad) => ({
      ...prevActividad,
      tipo_actividad: tipo,
      canal: canal,
      detalle_actividad: `Se va a realizar una acción de ${tipo} al prospecto`,
      estado_nuevo: tipo === 'nota' ? "contactado" : "seguimiento",
    }));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActividad((prevActividad) => ({
      ...prevActividad,
      [name]: value,
    }));
  };

  const handleGuardarActividad = () => {
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
      }}
    >
      <IconButton aria-label="Correo" onClick={() => handleOpen("correo", "email")}>
        <Email />
      </IconButton>
      <IconButton aria-label="Llamada" onClick={() => handleOpen("llamada", "telefono")}>
        <Call />
      </IconButton>
      <IconButton aria-label="WhatsApp" onClick={() => handleOpen("mensaje", "whatsapp")}>
        <WhatsApp />
      </IconButton>
      <IconButton aria-label="Crear Nota" onClick={() => handleOpen("nota", "interno")}>
        <NoteAdd />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Detalle de la Actividad
          </Typography>

          <TextField
            label="Tipo de Actividad"
            name="tipo_actividad"
            value={actividad.tipo_actividad}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Detalle de la Actividad"
            name="detalle_actividad"
            multiline
            rows={3}
            value={actividad.detalle_actividad}
            onChange={handleInputChange}
          />
          <TextField
            label="Fecha y Hora"
            name="fecha_hora"
            value={actividad.fecha_hora}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Estado Anterior"
            name="estado_anterior"
            value={actividad.estado_anterior}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Nuevo Estado"
            name="estado_nuevo"
            value={actividad.estado_nuevo}
            onChange={handleInputChange}
          />
          <TextField
            label="Canal"
            name="canal"
            value={actividad.canal}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button variant="contained" color="primary" onClick={handleGuardarActividad}>
            Guardar Actividad
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </Box>
      </Modal>
    </Box>
  );
}