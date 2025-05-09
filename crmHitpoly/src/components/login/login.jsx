import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Texto dinámico
  const words = [
    "Le damos resultados tangibles a tu visión",
    "Revolucionamos tu camino hacia el éxito",
    "Creamos un futuro de oportunidades",
  ];
  const colors = ["#6C4DE2", "#FBBC05", "#0B8DB5"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/usuarioMasterController.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            funcion: "login",
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        const userData = data.user;
        login(userData);
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Correo o contraseña incorrectos",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: "Hubo un problema al conectar con el servidor.",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F2F2F2",
        fontFamily: "'Poppins', sans-serif",
        padding: 2,
      }}
    >
      <Grid item xs={12} sm={10} md={6} lg={4}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: isSmallScreen ? 3 : 5,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              marginBottom: 1,
              fontSize: isSmallScreen ? "22px" : "26px",
            }}
          >
            Bienvenido a Formark CRM
          </Typography>

          <Typography
            variant="h6"
            sx={{
              width: "100%",
              color: colors[wordIndex],
              fontWeight: 600,
              fontSize: isSmallScreen ? "16px" : "18px",
              fontFamily: "Poppins, sans-serif",
              marginBottom: 3,
              transition: "color 0.5s ease",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            {words[wordIndex]}
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            type="email"
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "#1BAFBF",
              "&:hover": { backgroundColor: "#139ca7" },
              fontWeight: "bold",
              paddingY: 1.2,
              fontSize: "16px",
            }}
          >
            Ingresar
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Animación keyframes */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Grid>
  );
};

export default Login;
