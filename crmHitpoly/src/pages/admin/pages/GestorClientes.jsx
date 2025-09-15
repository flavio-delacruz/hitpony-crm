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

const GestorClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [closers, setClosers] = useState([]);
  const [setters, setSetters] = useState([]);
  const [asignacionesClientes, setAsignacionesClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [closersToAssign, setClosersToAssign] = useState([]);
  const [settersToAssign, setSettersToAssign] = useState([]);
  const [clienteToViewId, setClienteToView] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const ENDPOINT_GET_USERS = "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php";
  const ENDPOINT_TRAER_ASIGNACIONES = "https://apiweb.hitpoly.com/ajax/getCloserClientesController.php";
  const ENDPOINT_ASIGNAR = "https://apiweb.hitpoly.com/ajax/relacionCloserClienteController.php";
  const ENDPOINT_ELIMINAR = "https://apiweb.hitpoly.com/ajax/eliminarCloserClienteController.php";

  const fetchAllData = async () => {
    setError(null);
    setCargando(true);
    try {
      const [usersResponse, assignmentsResponse] = await Promise.all([
        fetch(ENDPOINT_GET_USERS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "getDataUsuarios" }),
        }),
        fetch(ENDPOINT_TRAER_ASIGNACIONES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        }),
      ]);

      const usersData = await usersResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      if (usersData?.data) {
        const newClosers = [];
        const newSetters = [];
        const newClientes = [];
        usersData.data.forEach((user) => {
          if (user.id_tipo == 3) newClosers.push(user);
          else if (user.id_tipo == 2) newSetters.push(user);
          else if (user.id_tipo == 4) newClientes.push(user);
        });
        setClosers(newClosers);
        setSetters(newSetters);
        setClientes(newClientes);
      }

      if (assignmentsData?.["Clientes-closers-setters"]) {
        setAsignacionesClientes(assignmentsData["Clientes-closers-setters"]);
      }
    } catch (err) {
      setError("No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const asignarCloserSetter = async (payload) => {
    try {
      await fetch(ENDPOINT_ASIGNAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchAllData();
      setSelectedClienteId("");
      setClosersToAssign([]);
      setSettersToAssign([]);
    } catch (err) {
      setError("No se pudo asignar a los usuarios.");
    }
  };

  const eliminarUsuario = async (clienteId, closerId, setterId) => {
    const payload = {
      accion: "delete",
      cliente_id: clienteId,
      closer_id: closerId,
      setter_id: setterId,
    };
    try {
      await fetch(ENDPOINT_ELIMINAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchAllData();
    } catch (err) {
      setError("No se pudo eliminar el usuario.");
    }
  };

  const handleClienteChange = (event) => {
    setSelectedClienteId(event.target.value);
    setClosersToAssign([]);
    setSettersToAssign([]);
  };

  const handleClosersChange = (event) => {
    const { value } = event.target;
    setClosersToAssign(typeof value === "string" ? value.split(",") : value);
  };

  const handleSettersChange = (event) => {
    const { value } = event.target;
    setSettersToAssign(typeof value === "string" ? value.split(",") : value);
  };

  const handleClienteToViewChange = (event) => {
    setClienteToView(event.target.value);
  };

  const handleAsignar = () => {
    if (selectedClienteId) {
      const payload = {
        accion: "asignarClosers",
        cliente_id: selectedClienteId,
      };
      if (closersToAssign.length > 0) {
        payload.closers_ids = closersToAssign.map(Number);
      }
      if (settersToAssign.length > 0) {
        payload.setters_ids = settersToAssign.map(Number);
      }
      asignarCloserSetter(payload);
    }
  };

  const getClienteName = (id) => {
    if (!id) return "Cliente no encontrado";
    const cliente = clientes.find((c) => c.id == id);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente ID: ${id}`;
  };

  const getCloserName = (id) => {
    const closer = closers.find((c) => c.id == id);
    return closer ? `${closer.nombre} ${closer.apellido}` : `Closer ID: ${id}`;
  };

  const getSetterName = (id) => {
    const setter = setters.find((s) => s.id == id);
    return setter ? `${setter.nombre} ${setter.apellido}` : `Setter ID: ${id}`;
  };

  const listaDeAsignacionesAMostrar = clienteToViewId
    ? asignacionesClientes.filter((a) => a.cliente_id == clienteToViewId)
    : asignacionesClientes.filter((a) => a.closers_ids?.length > 0 || a.setters_ids?.length > 0);

  const asignacionExistente = asignacionesClientes.find((a) => a.cliente_id == selectedClienteId);
  const closersYaAsignados = asignacionExistente?.closers_ids || [];
  const settersYaAsignados = asignacionExistente?.setters_ids || [];

  const closersDisponibles = closers.filter((closer) => !closersYaAsignados.includes(closer.id));
  const settersDisponibles = setters.filter((setter) => !settersYaAsignados.includes(setter.id));

  if (cargando) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4, display: "flex", gap: 4, width: "100%", flexDirection: { xs: "column", md: "row" } }}>
        {/* Panel Izquierdo: Formulario de Asignación */}
        <Box sx={{ flex: { xs: 1, md: "0 0 300px" }, p: 2, border: "1px solid #ddd", borderRadius: 2, height: "fit-content" }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Asignar Usuarios a Cliente
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="cliente-select-label">Seleccionar Cliente</InputLabel>
            <Select
              labelId="cliente-select-label"
              value={selectedClienteId}
              label="Seleccionar Cliente"
              onChange={handleClienteChange}
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedClienteId && (
            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="closers-select-label">Seleccionar Closers</InputLabel>
                <Select
                  labelId="closers-select-label"
                  multiple
                  value={closersToAssign}
                  onChange={handleClosersChange}
                  input={<OutlinedInput label="Seleccionar Closers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={getCloserName(value)} />
                      ))}
                    </Box>
                  )}
                >
                  {closersDisponibles.map((closer) => (
                    <MenuItem key={closer.id} value={closer.id}>
                      {closer.nombre} {closer.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="setters-select-label">Seleccionar Setters</InputLabel>
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
                >
                  {settersDisponibles.map((setter) => (
                    <MenuItem key={setter.id} value={setter.id}>
                      {setter.nombre} {setter.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}

          <Button
            variant="contained"
            fullWidth
            disabled={
              !selectedClienteId || (closersToAssign.length === 0 && settersToAssign.length === 0)
            }
            onClick={handleAsignar}
          >
            Asignar Usuarios
          </Button>
        </Box>

        {/* Panel Derecho: Vista de Asignaciones */}
        <Box sx={{ flex: 1, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Asignaciones Actuales por Cliente
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="cliente-view-select-label">Ver Asignaciones de Cliente</InputLabel>
            <Select
              labelId="cliente-view-select-label"
              value={clienteToViewId}
              label="Ver Asignaciones de Cliente"
              onChange={handleClienteToViewChange}
            >
              <MenuItem value="">
                <em>Todos los clientes</em>
              </MenuItem>
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {getClienteName(cliente.id)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ maxHeight: 450, overflowY: "auto" }}>
            <List>
              {listaDeAsignacionesAMostrar.length > 0 ? (
                listaDeAsignacionesAMostrar.map((asignacion) => (
                  <ListItem
                    key={asignacion.id}
                    sx={{ flexDirection: "column", alignItems: "flex-start", borderBottom: "1px solid #ddd", mb: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {asignacion.cliente_id ? getClienteName(asignacion.cliente_id) : "Cliente no asignado"}
                        </Typography>
                      }
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      Closers Asignados:
                    </Typography>
                    <List dense sx={{ width: "100%" }}>
                      {asignacion.closers_ids?.length > 0 ? (
                        asignacion.closers_ids.map((closerId) => (
                          <ListItem
                            key={`closer-${asignacion.id}-${closerId}`}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="eliminar"
                                onClick={() => eliminarUsuario(asignacion.cliente_id, closerId, null)}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            }
                          >
                            <ListItemText primary={getCloserName(closerId)} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem key={`no-closers-${asignacion.id}`}>
                          <ListItemText primary="Ninguno" sx={{ fontStyle: "italic" }} />
                        </ListItem>
                      )}
                    </List>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      Setters Asignados:
                    </Typography>
                    <List dense sx={{ width: "100%" }}>
                      {asignacion.setters_ids?.length > 0 ? (
                        asignacion.setters_ids.map((setterId) => (
                          <ListItem
                            key={`setter-${asignacion.id}-${setterId}`}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="eliminar"
                                onClick={() => eliminarUsuario(asignacion.cliente_id, null, setterId)}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            }
                          >
                            <ListItemText primary={getSetterName(setterId)} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem key={`no-setters-${asignacion.id}`}>
                          <ListItemText primary="Ninguno" sx={{ fontStyle: "italic" }} />
                        </ListItem>
                      )}
                    </List>
                  </ListItem>
                ))
              ) : (
                <ListItem key="no-asignaciones">
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

export default GestorClientes;