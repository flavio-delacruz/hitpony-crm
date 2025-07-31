import { Box, Typography, Button } from "@mui/material";

const ThankYouPage = () => {
  const externalLink = "https://hitpoly.com/"; // Cambia esto por el enlace al que deseas redirigir

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
        p: 4,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
        ¡Gracias por tu Registro!
      </Typography>

      <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
        Hemos recibido tu información. Nos pondremos en contacto contigo muy pronto.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <img
          src="/public/images/logohitpoly.png" // Puedes reemplazar esta URL con una imagen de agradecimiento personalizada
          alt="Thank you"
          style={{
            maxWidth: "200px",
          }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => window.location.href = externalLink} // Redirige al enlace externo
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        Regresar al Inicio
      </Button>

      <Typography variant="caption" display="block" align="center" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} Hitpoly. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default ThankYouPage;
