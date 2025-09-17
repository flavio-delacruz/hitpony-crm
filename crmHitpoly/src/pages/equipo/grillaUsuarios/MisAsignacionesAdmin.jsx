import React from "react";
import { Box, Typography, Grid, TextField, Paper } from "@mui/material";
import ContactoCard from "../../../components/cards/ContactoCard"; // Componente genérico para la tarjeta

const MisAsignacionesAdmin = ({
  contactos,
  userTypesMap,
  handleOpenCorreo,
  searchInput,
  setSearchInput,
}) => {
  const filterContactos = (contactos, term) => {
    if (!term) return contactos;
    const lowercasedTerm = term.toLowerCase();
    return contactos.filter(
      (contacto) =>
        (contacto.nombre && contacto.nombre.toLowerCase().includes(lowercasedTerm)) ||
        (contacto.apellido && contacto.apellido.toLowerCase().includes(lowercasedTerm)) ||
        (contacto.correo && contacto.correo.toLowerCase().includes(lowercasedTerm))
    );
  };

  const contactosParaMostrar = filterContactos(contactos, searchInput);

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          p: 1,
          mb: 4,
          backgroundColor: "#ffff",
        }}
      >
        <TextField
          label="Buscar miembro del equipo"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Paper>
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Todos los Usuarios
      </Typography>
      <Grid container spacing={3}>
        {contactosParaMostrar.length > 0 ? (
          contactosParaMostrar.map((contacto) => (
            <Grid item xs={12} sm={6} md={4} key={contacto.id}>
              <ContactoCard
                contacto={contacto}
                tipo={userTypesMap[contacto.id_tipo] || "Desconocido"}
                onOpenCorreo={handleOpenCorreo}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No se encontraron usuarios.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MisAsignacionesAdmin;