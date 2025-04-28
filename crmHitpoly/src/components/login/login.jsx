import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://apiweb.hitpoly.com/ajax/usuarioMasterController.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funcion: 'login', 
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("DATA:", data);

      if (data.status === "success") {
        const userData = data.user;
        console.log("USER", userData);
        
        // Aquí puedes hacer algo con el usuario, como guardarlo en un contexto o estado global
        // Ejemplo: login(userData);

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido al master de hitpoly!',
          text: 'Has iniciado sesión correctamente',
        });

        // Redirige al dashboard
        navigate('/master-full');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Correo o contraseña incorrectos',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'Hubo un problema al conectar con el servidor.',
      });
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "#F2F2F2" }}
    >
      <Grid item>
        <Box
          sx={{
            padding: "30px",
            maxWidth: "400px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Box
            component="h1"
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Iniciar Sesión
          </Box>

          <Box
            component="input"
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          
          <Box
            component="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          
          <Box
            component="button"
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#1BAFBF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Ingresar
          </Box>

          {error && (
            <Box sx={{ marginTop: "10px", color: "red", textAlign: "center" }}>
              {error}
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
