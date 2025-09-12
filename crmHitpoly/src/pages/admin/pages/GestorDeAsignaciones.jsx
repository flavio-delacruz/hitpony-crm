import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Layout from "../../../components/layout/layout";

const GestorDeAsignaciones = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [closers, setClosers] = useState([]);
  const [setters, setSetters] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedCloserId, setSelectedCloserId] = useState("");
  const [settersToAssign, setSettersToAssign] = useState([]);
  const [closerToViewId, setCloserToViewId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const ENDPOINT_GET_USERS =
    "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php";
  const ENDPOINT_TRAER_ASIGNACIONES =
    "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php";
  const ENDPOINT_ASIGNAR =
    "https://apiweb.hitpoly.com/ajax/asignarSetterCloserController.php";
  const ENDPOINT_ELIMINAR =
    "https://apiweb.hitpoly.com/ajax/deleteSetterListController.php";
  const ENDPOINT_AGREGAR =
    "https://apiweb.hitpoly.com/ajax/cargarSetterAListController.php";

  const obtenerUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(ENDPOINT_GET_USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "getDataUsuarios" }),
      });
      const datos = await respuesta.json();

      if (datos.data && Array.isArray(datos.data)) {
        setAllUsers(datos.data);
        const closersFiltrados = datos.data.filter(
          (user) => user.id_tipo === 3
        );
        const settersFiltrados = datos.data.filter(
          (user) => user.id_tipo === 2
        );
        setClosers(closersFiltrados);
        setSetters(settersFiltrados);
      }
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  const obtenerAsignaciones = async () => {
    try {
      const respuesta = await fetch(ENDPOINT_TRAER_ASIGNACIONES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "get" }),
      });
      const datos = await respuesta.json();

      if (datos.data && Array.isArray(datos.data)) {
        const asignacionesParseadas = datos.data.map((asignacion) => {
          return {
            ...asignacion,
            setters_ids:
              typeof asignacion.setters_ids === "string"
                ? JSON.parse(asignacion.setters_ids)
                : [],
          };
        });
        setAsignaciones(asignacionesParseadas);
      } else {
        setAsignaciones([]);
      }
    } catch (err) {
      setError("No se pudieron cargar las asignaciones.");
    }
  };

  const asignarSetters = async (closerId, settersIds) => {
    try {
      const respuesta = await fetch(ENDPOINT_ASIGNAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "asignar",
          closer_id: closerId,
          setters_ids: settersIds,
        }),
      });
      await respuesta.json();
      obtenerAsignaciones();
      setSelectedCloserId("");
      setSettersToAssign([]);
    } catch (err) {
      setError("No se pudieron asignar los setters.");
    }
  };

  const agregarSetter = async (closerId, setterId) => {
    try {
      const respuesta = await fetch(ENDPOINT_AGREGAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "add",
          idCloser: closerId,
          idSetter: setterId,
        }),
      });
      await respuesta.json();
      obtenerAsignaciones();
      setSelectedCloserId("");
      setSettersToAssign([]);
    } catch (err) {
      setError("No se pudo agregar el setter.");
    }
  };

  const eliminarSetter = async (closerId, setterId) => {
    try {
      const respuesta = await fetch(ENDPOINT_ELIMINAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "delete",
          idCloser: closerId,
          idSetter: setterId,
        }),
      });
      await respuesta.json();
      obtenerAsignaciones();
    } catch (err) {
      setError("No se pudo eliminar el setter.");
    }
  };

  const handleCloserChange = (event) => {
    setSelectedCloserId(event.target.value);
    setSettersToAssign([]);
  };

  const handleSettersChange = (event) => {
    const {
      target: { value },
    } = event;
    setSettersToAssign(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const handleCloserToViewChange = (event) => {
    setCloserToViewId(event.target.value);
  };

  const handleAsignar = () => {
    if (selectedCloserId && settersToAssign.length > 0) {
      const asignacionExistente = asignaciones.find(
        (a) => a.id_closer === selectedCloserId
      );
      const settersYaAsignadosACloser = asignacionExistente
        ? asignacionExistente.setters_ids
        : [];

      const nuevosSetters = settersToAssign.filter(
        (setterId) => !settersYaAsignadosACloser.includes(setterId)
      );

      if (asignacionExistente) {
        nuevosSetters.forEach((setterId) => {
          agregarSetter(selectedCloserId, setterId);
        });
      } else {
        asignarSetters(selectedCloserId, settersToAssign);
      }
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerAsignaciones();
  }, []);

  const todosLosSettersAsignados = asignaciones.reduce((acc, asignacion) => {
    if (Array.isArray(asignacion.setters_ids)) {
      return [...acc, ...asignacion.setters_ids];
    }
    return acc;
  }, []);

  const settersDisponibles = setters.filter(
    (setter) => !todosLosSettersAsignados.includes(setter.id)
  );

  const displayedAsignacion = asignaciones.find(
    (a) => a.id_closer === closerToViewId
  );

  const getCloserName = (id) => {
    const closer = closers.find((c) => c.id === id);
    return closer ? `${closer.nombre} ${closer.apellido}` : `Closer ID: ${id}`;
  };

  const getSetterName = (id) => {
    const setter = setters.find((s) => s.id === id);
    return setter ? `${setter.nombre} ${setter.apellido}` : `Setter ID: ${id}`;
  };
  
  // Nuevo filtro para solo mostrar closers con setters asignados
  const asignacionesConSetters = asignaciones.filter(
    (a) => a.setters_ids && a.setters_ids.length > 0
  );

  return (
    <Layout>
      <Box
        sx={{
          p: 4,
          display: "flex",
          gap: 4,
          width: "100%",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flex: { xs: 1, md: "0 0 300px" },
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            height: "fit-content",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Asignar Setters
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="closer-select-label">Seleccionar Closer</InputLabel>
            <Select
              labelId="closer-select-label"
              value={selectedCloserId}
              label="Seleccionar Closer"
              onChange={handleCloserChange}
            >
              {closers.map((closer) => (
                <MenuItem key={closer.id} value={closer.id}>
                  {closer.nombre} {closer.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCloserId && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="setters-select-label">
                Seleccionar Setters
              </InputLabel>
              <Select
                labelId="setters-select-label"
                multiple
                value={settersToAssign}
                onChange={handleSettersChange}
                input={<OutlinedInput label="Seleccionar Setters" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getSetterName(value)} />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      width: { xs: "80%", sm: "25%" },
                      ml: { xs: 0, sm: 35 },
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                {settersDisponibles.map((setter) => (
                  <MenuItem key={setter.id} value={setter.id}>
                    {setter.nombre} {setter.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            fullWidth
            disabled={!selectedCloserId || settersToAssign.length === 0}
            onClick={handleAsignar}
          >
            Asignar Setters
          </Button>
        </Box>

        {/* Panel Derecho: Vista de Asignaciones */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Asignaciones Actuales
          </Typography>

          {cargando && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="closer-view-select-label">
              Ver Asignaciones de Closer
            </InputLabel>
            <Select
              labelId="closer-view-select-label"
              value={closerToViewId}
              label="Ver Asignaciones de Closer"
              onChange={handleCloserToViewChange}
            >
              <MenuItem value="">
                <em>Todos los closers</em>
              </MenuItem>
              {closers.map((closer) => (
                <MenuItem key={closer.id} value={closer.id}>
                  {closer.nombre} {closer.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ maxHeight: 450, overflowY: "auto" }}>
            <List>
              {closerToViewId ? (
                displayedAsignacion ? (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {getCloserName(displayedAsignacion.id_closer)}
                          </Typography>
                        }
                        secondary="Setters Asignados:"
                      />
                    </ListItem>
                    <List sx={{ width: "100%" }}>
                      {displayedAsignacion.setters_ids.length > 0 ? (
                        displayedAsignacion.setters_ids.map(
                          (setterId, setterIndex) => (
                            <ListItem
                              key={setterIndex}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="eliminar"
                                  onClick={() =>
                                    eliminarSetter(
                                      displayedAsignacion.id_closer,
                                      setterId
                                    )
                                  }
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              }
                            >
                              <ListItemText primary={getSetterName(setterId)} />
                            </ListItem>
                          )
                        )
                      ) : (
                        <ListItem>
                          <ListItemText
                            primary="Ninguno"
                            sx={{ fontStyle: "italic" }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </>
                ) : (
                  <ListItem>
                    <ListItemText primary="Este closer no tiene asignaciones." />
                  </ListItem>
                )
              ) : asignacionesConSetters.length > 0 ? (
                asignacionesConSetters.map((asignacion, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderBottom: "1px solid #ddd",
                      mb: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {getCloserName(asignacion.id_closer)}
                        </Typography>
                      }
                      secondary="Setters Asignados:"
                    />
                    <List sx={{ width: "100%" }}>
                      {asignacion.setters_ids.length > 0 ? (
                        asignacion.setters_ids.map((setterId, setterIndex) => (
                          <ListItem
                            key={setterIndex}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="eliminar"
                                onClick={() =>
                                  eliminarSetter(asignacion.id_closer, setterId)
                                }
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            }
                          >
                            <ListItemText primary={getSetterName(setterId)} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText
                            primary="Ninguno"
                            sx={{ fontStyle: "italic" }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay asignaciones actuales." />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default GestorDeAsignaciones;