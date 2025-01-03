import { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography, Grid } from "@mui/material";

const EditModal = ({ open, onClose, contact }) => {
  const [formData, setFormData] = useState(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Datos editados:", formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Editar Información
        </Typography>
        <Grid
          container
          spacing={2}
        >
          {/* Campo Nombre */}
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

          {/* Campo Apellidos */}
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

          {/* Campo Correo Electrónico */}
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
            />
          </Grid>

          {/* Campo Teléfono */}
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

          {/* Campo Más */}
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Más información"
              name="mas"
              value={formData.mas}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        {/* Botones */}
        <Box
          display="flex"
          justifyContent="space-between"
          marginTop={2}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
