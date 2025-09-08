import { Box, Modal, Typography, TextField, Button, Tabs, Tab, Divider } from "@mui/material";
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

export default function Activities({ prospectoId, onEmailClick, onNoteClick }) {
  const [open, setOpen] = useState(false);
  const [actividad, setActividad] = useState({
    prospecto_id: prospectoId, 
    tipo_actividad: '',
    detalle_actividad: '',
    fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' '),
    estado_anterior: "en_proceso",
    estado_nuevo: '',
    canal: '',
  });
  
  const [tabValue, setTabValue] = useState("nota");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === "email") {
      // Llama a la función del componente padre para mostrar el contenido de correo
      if (onEmailClick) {
        onEmailClick(prospectoId);
      }
    } else if (newValue === "nota") {
      // Llama a la función del componente padre para mostrar el contenido de notas
      if (onNoteClick) {
        onNoteClick();
      }
    } else {
      // Para "Llamada" y "WhatsApp", abre el modal y establece los datos
      const tipo = newValue === "telefono" ? "llamada" : "mensaje";
      const canal = newValue === "telefono" ? "telefono" : "whatsapp";
      
      setActividad((prevActividad) => ({
        ...prevActividad,
        tipo_actividad: tipo,
        canal: canal,
        detalle_actividad: `Se va a realizar una acción de ${tipo} al prospecto`,
        estado_nuevo: "seguimiento",
      }));
      
      setOpen(true);
    }
  };
  
  const handleClose = () => {
    setOpen(false);
  };

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
        <Tab label="Correo" value="email" />
        <Tab label="Llamada" value="telefono" />
        <Tab label="WhatsApp" value="whatsapp" />
        <Tab label="Crear Nota" value="nota" />
      </Tabs>
      <Divider sx={{ mt: 1, mb: 2 }} />
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