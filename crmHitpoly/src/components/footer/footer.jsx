import React from "react";
// import Instagram from "../../assets/instagram-icon.svg";
// import Twitter from "../../assets/twitter-icon.svg";
// import Linkedin from "../../assets/linkedin-icon.svg";
// import Facebook from "../../assets/facebook-icon.svg";
import { Box, Grid, Typography, Link } from "@mui/material";
import styled from "@emotion/styled";
import Logo from "../../assets/logohitpoly.png";

const SocialIcon = styled("img")({
  width: "40px",
  height: "40px",
  margin: "0 10px",
  cursor: "pointer",
});

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#2D1638", padding: "40px 0" }}> 
      <Grid 
        container 
        spacing={4} 
        sx={{ maxWidth: "1200px", margin: "0 auto" }} 
        direction={{ xs: "column", md: "row" }}
        alignItems="flex-start"
      >
        <Grid item xs={12} md={4} order={{ xs: 1, md: 1 }}>
          <img src={Logo} alt="Hitpoly Logo" style={{ height: '60px', marginBottom: '20px' }} />
          <Typography variant="body1" color="#FFFFFF" sx={{ lineHeight: "1.8" }}> 
           
          </Typography>
        </Grid>
      
        <Grid item xs={12} md={2} order={{ xs: 2, md: 2 }}>
          <Typography variant="h6" color="#6C4DE2" gutterBottom>
            Menu
          </Typography>
          <Link href="/metricas" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            Dashboard
          </Link>
          <Link href="/contacto" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            info de contacto
          </Link>

          <Link href="/afiliados" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            info de afiliado
          </Link>

          <Link href="/usuarios" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            usuarios
          </Link>
         
        </Grid>

        <Grid item xs={12} md={3} order={{ xs: 3, md: 3 }}>
          <Typography variant="h6" color="#6C4DE2" gutterBottom>
            Politicas
          </Typography>
          <Link href="/politicas" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            Politicas de privacidad
          </Link>
          <Link href="/disclaimer" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            Descargo de responsabilidad
          </Link>
          <Link href="/terminos" color="#FFFFFF" underline="none" display="block" sx={{ marginBottom: "10px" }}>
            Terminos y condiciones
          </Link>
          <Link href="/Copyright" color="#FFFFFF" underline="none" display="block">
            Copyright
          </Link>
        </Grid>

        <Grid item xs={12} md={3} order={{ xs: 4, md: 4 }}>
          <Typography variant="h6" color="#6C4DE2" gutterBottom>
            Contacto
          </Typography>
     
          <Typography variant="body1" color="#FFFFFF" sx={{ marginBottom: "10px" }}>
      
          </Typography>
          <Typography variant="body1" color="#FFFFFF">
            info@hitpoly.com
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ backgroundColor: "#F2F2F2", borderTop: "1px solid #1ECDF4", marginTop: "40px", paddingTop: "20px" }}> 
        <Grid container justifyContent="space-between" alignItems="center" direction={{ xs: "column", md: "row" }} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Typography variant="body2" color="#000000" sx={{ marginBottom: { xs: "20px", md: "0" } }}>
            Copyright © 2024 hitpoly.com | Funciona con Hitpoly.com
          </Typography>
          <Box>
   
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;
