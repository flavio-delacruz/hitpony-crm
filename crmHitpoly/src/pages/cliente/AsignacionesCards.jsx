import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import Layout from "../../components/layout/layout";
import { useAuth } from "../../context/AuthContext";

const MisAsignacionesCards = () => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [asignacionesCliente, setAsignacionesCliente] = useState({
    closers_ids: [],
    setters_ids: [],
  });
  const [contactos, setContactos] = useState([]);
  const [selectedClosers, setSelectedClosers] = useState({});

  const ENDPOINT_CLIENTE_ASIGNACIONES =
    "https://apiweb.hitpoly.com/ajax/getCloserClientesController.php";
  const ENDPOINT_GET_USERS =
    "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php";
  const ENDPOINT_ADD_SETTER =
    "https://apiweb.hitpoly.com/ajax/cargarSetterAListController.php";
  const ENDPOINT_DELETE_SETTER =
    "https://apiweb.hitpoly.com/ajax/deleteSetterListController.php";
  const ENDPOINT_TRAER_ASIGNACIONES =
    "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php";

  useEffect(() => {
    const fetchDatos = async () => {
      if (!user || !user.id || user.id_tipo !== 4) {
        setError("Acceso denegado: Este componente es solo para clientes.");
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        const [
          asignacionesRes,
          usuariosRes,
          asignacionesCloserSetterRes,
        ] = await Promise.all([
          fetch(ENDPOINT_CLIENTE_ASIGNACIONES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accion: "get", cliente_id: user.id }),
          }),
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

        const asignacionesData = await asignacionesRes.json();
        const usuariosData = await usuariosRes.json();
        const asignacionesCloserSetterData = await asignacionesCloserSetterRes.json();

        let foundAsignacion = null;
        if (
          asignacionesData.success &&
          Array.isArray(asignacionesData["Clientes-closers-setters"])
        ) {
          foundAsignacion = asignacionesData["Clientes-closers-setters"].find(
            (asignacion) =>
              asignacion.cliente_id.toString() === user.id.toString()
          );
        }

        if (foundAsignacion) {
          const closersIdsAsStrings = foundAsignacion.closers_ids.map(id => id.toString());
          const settersIdsAsStrings = foundAsignacion.setters_ids.map(id => id.toString());

          setAsignacionesCliente({
            closers_ids: closersIdsAsStrings,
            setters_ids: settersIdsAsStrings,
          });

          const allAssignedUserIds = [...closersIdsAsStrings, ...settersIdsAsStrings];
          const assignedContacts = usuariosData.data.filter(usuario => 
            allAssignedUserIds.includes(usuario.id.toString())
          );
          setContactos(assignedContacts);

          const newSelectedClosers = {};
          settersIdsAsStrings.forEach((setterId) => {
            newSelectedClosers[setterId] = [];
          });

          if (asignacionesCloserSetterData.success && Array.isArray(asignacionesCloserSetterData.data)) {
            asignacionesCloserSetterData.data.forEach((asignacion) => {
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
          setContactos([]); 
        }

      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudieron cargar tus asignaciones. Inténtalo de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, [user]);

  const getContacto = (id) => {
    return contactos.find((contacto) => contacto.id.toString() === id.toString());
  };

  const closersAsignados = asignacionesCliente.closers_ids
    .map(getContacto)
    .filter(Boolean);
  const settersAsignados = asignacionesCliente.setters_ids
    .map(getContacto)
    .filter(Boolean);

  const handleCloserChange = async (setterId, event) => {
    const newSelectedCloserIds = event.target.value;
    const currentSelections = selectedClosers[setterId] || [];

    const addedIds = newSelectedCloserIds.filter(id => !currentSelections.includes(id));
    const removedIds = currentSelections.filter(id => !newSelectedCloserIds.includes(id));

    setSelectedClosers(prevSelected => ({
      ...prevSelected,
      [setterId]: newSelectedCloserIds,
    }));

    try {
      if (addedIds.length > 0) {
        const payload = {
          accion: "add",
          idCloser: addedIds[0],
          idSetter: setterId,
        };
        const response = await fetch(ENDPOINT_ADD_SETTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error("API falló al añadir el setter.");
        }
      }

      if (removedIds.length > 0) {
        const payload = {
          accion: "delete",
          idCloser: removedIds[0],
          idSetter: setterId,
        };
        const response = await fetch(ENDPOINT_DELETE_SETTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error("API falló al eliminar el setter.");
        }
      }
    } catch (err) {
      console.error("❌ Error al actualizar la asignación:", err);
      alert("Error al actualizar la asignación. Inténtalo de nuevo.");
      setSelectedClosers(prev => ({
        ...prev,
        [setterId]: currentSelections,
      }));
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Asignaciones
        </Typography>

        {cargando && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!cargando && !error && (
          <Box>
            <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
              Closers Asignados
            </Typography>
            <Grid container spacing={3}>
              {closersAsignados.length > 0 ? (
                closersAsignados.map((closer) => (
                  <Grid item xs={12} sm={6} md={4} key={closer.id}>
                    <Card raised>
                      <CardContent>
                        <Typography variant="h6">
                          {closer.nombre} {closer.apellido}
                        </Typography>
                        <Typography color="text.secondary">Closer</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Email: {closer.email}
                        </Typography>
                        <Typography variant="body2">
                          Teléfono: {closer.telefono}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>No tienes closers asignados.</Typography>
                </Grid>
              )}
            </Grid>
            ---
            <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
              Setters Asignados
            </Typography>
            <Grid container spacing={3}>
              {settersAsignados.length > 0 ? (
                settersAsignados.map((setter) => (
                  <Grid item xs={12} sm={6} md={4} key={setter.id}>
                    <Card raised>
                      <CardContent>
                        <Typography variant="h6">
                          {setter.nombre} {setter.apellido}
                        </Typography>
                        <Typography color="text.secondary">Setter</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Email: {setter.email}
                        </Typography>
                        <Typography variant="body2">
                          Teléfono: {setter.telefono}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Closers asignados:
                          </Typography>
                          {selectedClosers[setter.id] && selectedClosers[setter.id].length > 0 ? (
                            selectedClosers[setter.id].map((closerId) => {
                              const closer = getContacto(closerId);
                              return (
                                closer && (
                                  <Typography key={closerId} variant="body2">
                                    - {closer.nombre} {closer.apellido}
                                  </Typography>
                                )
                              );
                            })
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No hay closers asignados.
                            </Typography>
                          )}
                        </Box>
                        
                        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                          <Select
                            multiple
                            value={selectedClosers[setter.id] || []}
                            onChange={(event) => handleCloserChange(setter.id, event)}
                            input={<OutlinedInput />}
                            displayEmpty
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return <em>Relacionar Closer</em>;
                              }
                              return "Relacionar Closer";
                            }}
                          >
                            <MenuItem disabled value="">
                              <em>Relacionar Closer</em>
                            </MenuItem>
                            {closersAsignados.map((closer) => (
                              <MenuItem key={closer.id} value={closer.id.toString()}>
                                <Checkbox checked={(selectedClosers[setter.id] || []).includes(closer.id.toString())} />
                                <ListItemText primary={`${closer.nombre} ${closer.apellido}`} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>No tienes setters asignados.</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default MisAsignacionesCards;