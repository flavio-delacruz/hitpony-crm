import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, Paper } from "@mui/material";
import ContactoCard from "../../../components/cards/ContactoCard"; // Componente genérico para la tarjeta

const MisAsignacionesCloser = ({
  user,
  contactos,
  asignaciones,
  asignacionesCloserSetter,
  getContacto,
  handleOpenCorreo,
  searchInput,
  setSearchInput,
}) => {
  const [clienteAsignado, setClienteAsignado] = useState(null);
  const [settersAsignados, setSettersAsignados] = useState([]);

  useEffect(() => {
    const clienteFound = asignaciones.find((asignacion) =>
      asignacion.closers_ids.some((closerId) => closerId.toString() === user.id.toString())
    );
    if (clienteFound) {
      const clienteInfo = getContacto(clienteFound.cliente_id);
      setClienteAsignado(clienteInfo);
    } else {
      setClienteAsignado(null);
    }

    const miAsignacion = asignacionesCloserSetter.find(
      (a) => a.id_closer.toString() === user.id.toString()
    );
    if (miAsignacion && miAsignacion.setters_ids) {
      try {
        const setterIdsFromApi = JSON.parse(miAsignacion.setters_ids);
        const setters = setterIdsFromApi.map(getContacto).filter(Boolean);
        setSettersAsignados(setters);
      } catch (e) {
        console.error("Error al parsear setters_ids:", e);
        setSettersAsignados([]);
      }
    } else {
      setSettersAsignados([]);
    }
  }, [asignaciones, asignacionesCloserSetter, user.id, getContacto]);

  const filterContactos = (contacts, term) => {
    if (!term) return contacts;
    const lowercasedTerm = term.toLowerCase();
    return contacts.filter(
      (c) =>
        (c.nombre && c.nombre.toLowerCase().includes(lowercasedTerm)) ||
        (c.apellido && c.apellido.toLowerCase().includes(lowercasedTerm)) ||
        (c.correo && c.correo.toLowerCase().includes(lowercasedTerm))
    );
  };

  const settersFiltrados = filterContactos(settersAsignados, searchInput);

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
        {clienteAsignado ? (
          <Grid item xs={12} sm={6} md={4}>
            <ContactoCard
              contacto={clienteAsignado}
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
        Setters Asignados
      </Typography>
      <Grid container spacing={3}>
        {settersFiltrados.length > 0 ? (
          settersFiltrados.map((setter) => (
            <Grid item xs={12} sm={6} md={4} key={setter.id}>
              <ContactoCard
                contacto={setter}
                tipo="Setter"
                onOpenCorreo={handleOpenCorreo}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No tienes setters asignados.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MisAsignacionesCloser;