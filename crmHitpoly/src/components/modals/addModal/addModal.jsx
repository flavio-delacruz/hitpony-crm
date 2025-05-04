import { useState } from "react";
import { Modal, Box, TextField, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AddModal = ({ open, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
    celular: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      funcion: "registrar",
      idSetter: user?.id || "0",
      ...formData,
      origen: "interno",
    };

    try {
      await fetch("https://apiweb.hitpoly.com/ajax/registerProspectoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: "success",
        title: "Prospecto registrado correctamente",
      });
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Botón de cierre */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "50%",
            padding: 0.5,
            '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>Registrar Prospecto</Typography>

        <TextField
          name="nombre"
          label="Nombre"
          fullWidth
          margin="normal"
          value={formData.nombre}
          onChange={handleChange}
        />
        <TextField
          name="apellido"
          label="Apellido"
          fullWidth
          margin="normal"
          value={formData.apellido}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="cargo"
          label="Cargo"
          fullWidth
          margin="normal"
          value={formData.cargo}
          onChange={handleChange}
        />

        {/* Teléfono con código de país */}
        <Box sx={{ mt: 2 }}>
          <PhoneInput
            country={"pe"}
            enableSearch
            inputStyle={{ width: "100%" }}
            value={formData.celular}
            onChange={(value) => setFormData({ ...formData, celular: value })}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </Box>
    </Modal>
  );
};

export default AddModal;
