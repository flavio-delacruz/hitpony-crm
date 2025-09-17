import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  Paper,
} from "@mui/material";
import ContactoCard from "../../../components/cards/ContactoCard";
import CloserSetterCard from "../../../components/cards/CloserSetterCard";

// Endpoints para las diferentes acciones
const ENDPOINT_ASIGNAR_MASIVO =
  "https://apiweb.hitpoly.com/ajax/asignarSetterCloserController.php";
const ENDPOINT_ADD_SETTER =
  "https://apiweb.hitpoly.com/ajax/cargarSetterAListController.php";
const ENDPOINT_DELETE_SETTER =
  "https://apiweb.hitpoly.com/ajax/deleteSetterListController.php";

const MisAsignacionesCliente = ({
  user,
  contactos,
  asignaciones,
  asignacionesCloserSetter,
  getContacto,
  handleOpenCorreo,
  searchInput,
  setSearchInput,
}) => {
  const [asignacionesCliente, setAsignacionesCliente] = useState({
    closers_ids: [],
    setters_ids: [],
  });
  const [selectedClosers, setSelectedClosers] = useState({});

  useEffect(() => {
    const foundAsignacion = asignaciones.find(
      (asignacion) => asignacion.cliente_id.toString() === user.id.toString()
    );

    if (foundAsignacion) {
      const closersIdsAsStrings = foundAsignacion.closers_ids.map((id) =>
        id.toString()
      );
      const settersIdsAsStrings = foundAsignacion.setters_ids.map((id) =>
        id.toString()
      );

      setAsignacionesCliente({
        closers_ids: closersIdsAsStrings,
        setters_ids: settersIdsAsStrings,
      });

      const newSelectedClosers = {};
      settersIdsAsStrings.forEach((setterId) => {
        newSelectedClosers[setterId] = [];
      });

      if (asignacionesCloserSetter && Array.isArray(asignacionesCloserSetter)) {
        asignacionesCloserSetter.forEach((asignacion) => {
          if (asignacion.id_closer && asignacion.setters_ids) {
            try {
              const setterIdsFromApi = JSON.parse(asignacion.setters_ids);
              setterIdsFromApi.forEach((setterId) => {
                const setterIdStr = setterId.toString();
                const closerIdStr = asignacion.id_closer.toString();
                if (newSelectedClosers[setterIdStr]) {
                  newSelectedClosers[setterIdStr].push(closerIdStr);
                }
              });
            } catch (e) {
              console.error("Error al parsear setters_ids:", e);
            }
          }
        });
      }
      setSelectedClosers(newSelectedClosers);
    } else {
      setAsignacionesCliente({ closers_ids: [], setters_ids: [] });
      setSelectedClosers({});
    }
  }, [asignaciones, asignacionesCloserSetter, user.id]);

  const closersAsignados = asignacionesCliente.closers_ids
    .map(getContacto)
    .filter(Boolean);
  const settersAsignados = asignacionesCliente.setters_ids
    .map(getContacto)
    .filter(Boolean);

  const filterContactos = (contacts, term) => {
    if (!term) return contacts;
    const lowercasedTerm = term.toLowerCase();
    const filtered = contacts.filter(
      (c) =>
        (c.nombre && c.nombre.toLowerCase().includes(lowercasedTerm)) ||
        (c.apellido && c.apellido.toLowerCase().includes(lowercasedTerm)) ||
        (c.correo && c.correo.toLowerCase().includes(lowercasedTerm))
    );
    return filtered;
  };

  const closersFiltrados = filterContactos(closersAsignados, searchInput);
  const settersFiltrados = filterContactos(settersAsignados, searchInput);

  const handleCloserChange = async (setterId, event) => {
    const newSelectedCloserIds = event.target.value;
    const currentSelections = selectedClosers[setterId] || [];

    const addedIds = newSelectedCloserIds.filter(
      (id) => !currentSelections.includes(id)
    );
    const removedIds = currentSelections.filter(
      (id) => !newSelectedCloserIds.includes(id)
    );

    setSelectedClosers((prevSelected) => ({
      ...prevSelected,
      [setterId]: newSelectedCloserIds,
    }));

    try {
      // 🚀 Lógica de Asignación Inteligente 🚀
      // Primero, verifica si el closer ya tiene una asignación existente en la tabla
      const closerHasExistingRelation = asignacionesCloserSetter.some(
        (asignacion) => asignacion.id_closer.toString() === addedIds[0]
      );

      if (addedIds.length > 0) {
        if (!closerHasExistingRelation) {
          // Si no existe, usamos el endpoint de asignación masiva para crearla
          console.log(`Creando nueva asignación para closer ${addedIds[0]} con el setter ${setterId}.`);
          const response = await fetch(ENDPOINT_ASIGNAR_MASIVO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accion: "asignar",
              closer_id: parseInt(addedIds[0]),
              setters_ids: [parseInt(setterId)],
            }),
          });
          const data = await response.json();
          console.log("Respuesta de la API (crear):", data);
          if (!data.success) throw new Error(data.message);
        } else {
          // Si ya existe, usamos el endpoint de adición individual
          for (const addedId of addedIds) {
            console.log(`Añadiendo closer ${addedId} a la relación existente con setter ${setterId}.`);
            const response = await fetch(ENDPOINT_ADD_SETTER, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accion: "add",
                idCloser: addedId,
                idSetter: setterId,
              }),
            });
            const data = await response.json();
            console.log("Respuesta de la API (add):", data);
            if (!data.success) throw new Error(data.message);
          }
        }
      }

      // ❌ Lógica de Eliminación (siempre individual)
      if (removedIds.length > 0) {
        for (const removedId of removedIds) {
          console.log(`Eliminando closer ${removedId} del setter ${setterId}.`);
          const response = await fetch(ENDPOINT_DELETE_SETTER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accion: "delete",
              idCloser: removedId,
              idSetter: setterId,
            }),
          });
          const data = await response.json();
          console.log("Respuesta de la API (delete):", data);
          if (!data.success) throw new Error(data.message);
        }
      }
    } catch (err) {
      console.error("❌ Error al actualizar la asignación:", err);
      alert("Error al actualizar la asignación. Inténtalo de nuevo.");
      // Revertir a las selecciones anteriores en caso de error
      setSelectedClosers((prev) => ({
        ...prev,
        [setterId]: currentSelections,
      }));
    }
  };

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
        Closers Asignados
      </Typography>
      <Grid container spacing={3}>
        {closersFiltrados.length > 0 ? (
          closersFiltrados.map((closer) => (
            <Grid item xs={12} sm={6} md={4} key={closer.id}>
              <ContactoCard
                contacto={closer}
                tipo="Closer"
                onOpenCorreo={handleOpenCorreo}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No tienes closers asignados.</Typography>
          </Grid>
        )}
      </Grid>
      <hr />
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Setters Asignados
      </Typography>
      <Grid container spacing={3}>
        {settersFiltrados.length > 0 ? (
          settersFiltrados.map((setter) => (
            <Grid item xs={12} sm={6} md={4} key={setter.id}>
              <CloserSetterCard
                setter={setter}
                selectedClosers={selectedClosers}
                closersAsignados={closersAsignados}
                handleCloserChange={handleCloserChange}
                getContacto={getContacto}
                handleOpenCorreo={handleOpenCorreo}
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

export default MisAsignacionesCliente;