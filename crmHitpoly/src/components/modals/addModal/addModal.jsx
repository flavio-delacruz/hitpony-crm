import { useState } from "react";
import { Modal, Box, TextField, Button, IconButton, Typography, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!formData.celular || formData.celular === "") {
      setAlertMessage("Por favor, ingresa un número de teléfono válido.");
      setOpenAlert(true);
      return;
    }

    if (!validateEmail(formData.email)) {
      setAlertMessage("El correo electrónico ingresado no es válido.");
      setOpenAlert(true);
      return;
    }

    const payload = {
      funcion: "registrar",
      idSetter: user?.id || "0",
      estado_contacto: "leads",
      ...formData,
      origen: "interno",
    };

    try {
      await fetch("https://apiweb.hitpoly.com/ajax/registerProspectoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setAlertMessage("¡Prospecto registrado correctamente!");
      setOpenAlert(true);
      onSave(formData);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        cargo: "",
        celular: "",
      });
      onClose();
    } catch (error) {
      setAlertMessage("Hubo un error al registrar el prospecto. Intenta nuevamente.");
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
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

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertMessage.includes("correctamente") ? "success" : "error"}
          sx={{
            backgroundColor: "white",
            color: "black",
            width: "100%",
            borderRadius: 1,
            fontWeight: 'bold',
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddModal;
