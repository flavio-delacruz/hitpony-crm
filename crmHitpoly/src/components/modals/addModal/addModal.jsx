import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const AddModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      direccion: "",
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={modalStyle}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Añadir Información Personal
        </Typography>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box
          mt={3}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddModal;
