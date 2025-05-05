import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useSearchParams, useNavigate } from "react-router-dom"; // Agregar useNavigate
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PublicClientForm = ({ titulo = "Formulario de Registro", subtitulo = "", portada = null }) => {
  const [searchParams] = useSearchParams();
  const idSetter = searchParams.get("idSetter") || "0";
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
    celular: "",
  });

  const navigate = useNavigate(); // Usar useNavigate para la redirección

  useEffect(() => {
    if (idSetter !== "0") {
      setMostrarFormulario(true);
    }
  }, [idSetter]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    const { email, celular } = formData;
  
    if (!email && !celular) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Debes ingresar al menos un correo o un número de celular.",
      });
      return;
    }
  
    if (email && !validateEmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }
  
    const payload = {
      funcion: "registrar",
      idSetter,
      origen: "formulario",  // Añadido para indicar que este registro es externo
      ...formData,
    };
  
    try {
      await fetch("https://apiweb.hitpoly.com/ajax/registerProspectoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Redirigir a una nueva página después del éxito
      navigate("/gracias-por-confiar-en-hitpoly");  // Cambia a la ruta que deseas

      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        cargo: "",
        celular: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: "No se pudo enviar el formulario.",
      });
    }
  };

  if (!mostrarFormulario) return null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {portada && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          {typeof portada === "string" ? (
            <img src={portada} alt="Portada" style={{ maxWidth: "100%", borderRadius: 8 }} />
          ) : (
            portada
          )}
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        {titulo}
      </Typography>
      {subtitulo && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {subtitulo}
        </Typography>
      )}

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
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
        type="email"
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

      <Typography variant="caption" display="block" align="center" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} Hitpoly. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default PublicClientForm;
