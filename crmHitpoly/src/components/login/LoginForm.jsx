
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  useMediaQuery,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LoginForm = ( { handleLogin } ) => {
  const [isRegister, setIsRegister] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
        className="animate__animated animate__backInRight"
        sx={{
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Paper
            elevation={6}
            sx={{
            width: isSmall ? "100%" : 400,
            p: 4,
            borderRadius: 4,
            bgcolor: "#fff",
            boxShadow:
                "0 10px 30px rgba(0,0,0,0.15)",
            }}
        >
            <Typography
                variant="h4"
                align="center"
                sx={{
                    fontWeight: 700,
                    color: "#0B8DB5",
                    mb: 3,
                }}
            >
                {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </Typography>

            <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            >
            {isRegister && (
                <TextField
                    fullWidth
                    label="Nombre Completo"
                    type="email"
                    variant="outlined"
                    InputLabelProps={{
                        sx: {
                        color: "#0B8DB5", // color del label por defecto
                        fontWeight: 600,
                        "&.Mui-focused": { color: "#00FFFF" }, // color cuando el input está enfocado
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#0B8DB5", // borde normal
                        },
                        "&:hover fieldset": {
                            borderColor: "#00FFFF", // borde al pasar el mouse
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#00FFFF", // borde al enfocar
                        },
                        },
                    }}
                />
            )}
                <TextField
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    variant="outlined"
                    InputLabelProps={{
                        sx: {
                        color: "#0B8DB5", // color del label por defecto
                        fontWeight: 600,
                        "&.Mui-focused": { color: "#00FFFF" }, // color cuando el input está enfocado
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#0B8DB5", // borde normal
                        },
                        "&:hover fieldset": {
                            borderColor: "#00FFFF", // borde al pasar el mouse
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#00FFFF", // borde al enfocar
                        },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Contraseña"
                    type="email"
                    variant="outlined"
                    InputLabelProps={{
                        sx: {
                        color: "#0B8DB5", // color del label por defecto
                        fontWeight: 600,
                        "&.Mui-focused": { color: "#00FFFF" }, // color cuando el input está enfocado
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#0B8DB5", // borde normal
                        },
                        "&:hover fieldset": {
                            borderColor: "#00FFFF", // borde al pasar el mouse
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#00FFFF", // borde al enfocar
                        },
                        },
                    }}
                />

            {isRegister && (
                <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    type="email"
                    variant="outlined"
                    InputLabelProps={{
                        sx: {
                        color: "#0B8DB5", // color del label por defecto
                        fontWeight: 600,
                        "&.Mui-focused": { color: "#00FFFF" }, // color cuando el input está enfocado
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#0B8DB5", // borde normal
                        },
                        "&:hover fieldset": {
                            borderColor: "#00FFFF", // borde al pasar el mouse
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#00FFFF", // borde al enfocar
                        },
                        },
                    }}
                />
            )}

                <Button
                    onClick={handleLogin}
                    variant="contained"
                    sx={{
                    mt: 2,
                    bgcolor: "#0B8DB5",
                    "&:hover": { bgcolor: "#009FCB" },
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.2,
                    fontSize: "1rem",
                    }}
                >
                    {isRegister ? "Registrarse" : "Ingresar"}
                </Button>
            </Box>

            <Typography
                align="center"
                sx={{ mt: 3, color: "#333" }}
            >
                {isRegister
                    ? "¿Ya tienes una cuenta?"
                    : "¿No tienes una cuenta?"}{" "}
                <Link
                    component="button"
                    underline="hover"
                    sx={{
                    color: "#0B8DB5",
                    fontWeight: 600,
                    }}
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? "Inicia sesión" : "Crea una cuenta"}
                </Link>
            </Typography>
        </Paper>
    </Box>
  );
};

export default LoginForm;
