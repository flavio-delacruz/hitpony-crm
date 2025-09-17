import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, Paper } from "@mui/material";
import ContactoCard from "../../../components/cards/ContactoCard"; // Componente genérico para la tarjeta

const MisAsignacionesSetter = ({
  user,
  contactos,
  asignaciones,
  asignacionesCloserSetter,
  getContacto,
  handleOpenCorreo,
  searchInput,
  setSearchInput,
}) => {
  const [closerAsignado, setCloserAsignado] = useState(null);
  const [clienteAsignado, setClienteAsignado] = useState(null);

  useEffect(() => {
    let foundCloser = null;
    if (asignacionesCloserSetter && Array.isArray(asignacionesCloserSetter)) {
      for (const asignacion of asignacionesCloserSetter) {
        if (asignacion.setters_ids) {
          try {
            const setterIdsFromApi = JSON.parse(asignacion.setters_ids);
            if (
              setterIdsFromApi.map((id) => id.toString()).includes(user.id.toString())
            ) {
              foundCloser = getContacto(asignacion.id_closer);
              break;
            }
          } catch (e) {
            console.error("Error al parsear setters_ids:", e);
          }
        }
      }
    }
    setCloserAsignado(foundCloser);

    if (foundCloser && asignaciones && Array.isArray(asignaciones)) {
      const clienteFound = asignaciones.find((cliAsig) =>
        cliAsig.closers_ids.some((closerId) => closerId.toString() === foundCloser.id.toString())
      );
      if (clienteFound) {
        const clienteInfo = getContacto(clienteFound.cliente_id);
        setClienteAsignado(clienteInfo);
      } else {
        setClienteAsignado(null);
      }
    } else {
      setClienteAsignado(null);
    }
  }, [asignaciones, asignacionesCloserSetter, user.id, getContacto]);

  const closersFiltrados = closerAsignado
    ? [closerAsignado].filter((c) =>
        (c.nombre && c.nombre.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.apellido && c.apellido.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.correo && c.correo.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : [];

  const clienteFiltrado = clienteAsignado
    ? [clienteAsignado].filter((c) =>
        (c.nombre && c.nombre.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.apellido && c.apellido.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.correo && c.correo.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : [];

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
        Cliente Asignado
      </Typography>
      <Grid container spacing={3}>
        {clienteFiltrado.length > 0 ? (
          <Grid item xs={12} sm={6} md={4}>
            <ContactoCard
              contacto={clienteFiltrado[0]}
              tipo="Cliente"
              onOpenCorreo={handleOpenCorreo}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography>No tienes un cliente asignado.</Typography>
          </Grid>
        )}
      </Grid>
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Closer Asignado
      </Typography>
      <Grid container spacing={3}>
        {closersFiltrados.length > 0 ? (
          <Grid item xs={12} sm={6} md={4}>
            <ContactoCard
              contacto={closersFiltrados[0]}
              tipo="Closer"
              onOpenCorreo={handleOpenCorreo}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography>No tienes un closer asignado.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MisAsignacionesSetter;