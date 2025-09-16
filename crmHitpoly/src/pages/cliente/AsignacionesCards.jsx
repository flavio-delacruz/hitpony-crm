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
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import Layout from "../../components/layout/layout";
import { useAuth } from "../../context/AuthContext";
import CorreoFlotanteUsuarios from "../../components/correos/enviados/CorreoFlotanteUsuarios";

const MisAsignacionesCards = () => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [asignacionesCliente, setAsignacionesCliente] = useState({
    closers_ids: [],
    setters_ids: [],
  });
  const [closerAsignado, setCloserAsignado] = useState(null);
  const [clienteAsignado, setClienteAsignado] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [selectedClosers, setSelectedClosers] = useState({});
  const [openCorreoFlotante, setOpenCorreoFlotante] = useState(false);
  const [contactoParaCorreo, setContactoParaCorreo] = useState(null);
  const [searchInput, setSearchInput] = useState("");

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
      if (
        !user ||
        !user.id ||
        (user.id_tipo !== 4 && user.id_tipo !== 3 && user.id_tipo !== 2)
      ) {
        setError(
          "Acceso denegado: Este componente es solo para clientes, closers o setters."
        );
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        let asignacionesCloserSetterData;
        let foundAsignacion = null;
        let usuariosData;
        let clienteAsignacionData;

        const usuariosRes = await fetch(ENDPOINT_GET_USERS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "getDataUsuarios" }),
        });
        usuariosData = await usuariosRes.json();
        setContactos(usuariosData.data);

        if (user.id_tipo === 4) {
          const [asignacionesRes, asignacionesCloserSetterRes] =
            await Promise.all([
              fetch(ENDPOINT_CLIENTE_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get", cliente_id: user.id }),
              }),
              fetch(ENDPOINT_TRAER_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get" }),
              }),
            ]);

          const asignacionesData = await asignacionesRes.json();
          asignacionesCloserSetterData = await asignacionesCloserSetterRes.json();

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

            if (
              asignacionesCloserSetterData.success &&
              Array.isArray(asignacionesCloserSetterData.data)
            ) {
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
          }
        } else if (user.id_tipo === 3) {
          const [asignacionesCloserSetterRes, clienteAsignacionRes] =
            await Promise.all([
              fetch(ENDPOINT_TRAER_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get", id_closer: user.id }),
              }),
              fetch(ENDPOINT_CLIENTE_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get" }),
              }),
            ]);

          asignacionesCloserSetterData = await asignacionesCloserSetterRes.json();
          clienteAsignacionData = await clienteAsignacionRes.json();

          if (
            clienteAsignacionData.success &&
            Array.isArray(clienteAsignacionData["Clientes-closers-setters"])
          ) {
            const clienteFound = clienteAsignacionData[
              "Clientes-closers-setters"
            ].find((asignacion) => {
              return asignacion.closers_ids.some(
                (closerId) => closerId.toString() === user.id.toString()
              );
            });
            if (clienteFound) {
              const clienteInfo = usuariosData.data.find(
                (u) => u.id.toString() === clienteFound.cliente_id.toString()
              );
              setClienteAsignado(clienteInfo);
            }
          }

          const settersAsignados = [];
          if (
            asignacionesCloserSetterData.success &&
            Array.isArray(asignacionesCloserSetterData.data)
          ) {
            const miAsignacion = asignacionesCloserSetterData.data.find(
              (a) => a.id_closer.toString() === user.id.toString()
            );
            if (miAsignacion && miAsignacion.setters_ids) {
              try {
                const setterIdsFromApi = JSON.parse(miAsignacion.setters_ids);
                setterIdsFromApi.forEach((setterId) =>
                  settersAsignados.push(setterId.toString())
                );
              } catch (e) {
                console.error("Error al parsear setters_ids:", e);
              }
            }
          }
          setAsignacionesCliente({
            closers_ids: [user.id.toString()],
            setters_ids: settersAsignados,
          });
          setSelectedClosers({});
        } else if (user.id_tipo === 2) {
          const [asignacionesCloserSetterRes, clienteAsignacionRes] =
            await Promise.all([
              fetch(ENDPOINT_TRAER_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get" }),
              }),
              fetch(ENDPOINT_CLIENTE_ASIGNACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "get" }),
              }),
            ]);
          asignacionesCloserSetterData = await asignacionesCloserSetterRes.json();
          clienteAsignacionData = await clienteAsignacionRes.json();

          let foundCloser = null;
          if (
            asignacionesCloserSetterData.success &&
            Array.isArray(asignacionesCloserSetterData.data)
          ) {
            for (const asignacion of asignacionesCloserSetterData.data) {
              if (asignacion.setters_ids) {
                try {
                  const setterIdsFromApi = JSON.parse(asignacion.setters_ids);
                  if (
                    setterIdsFromApi
                      .map((id) => id.toString())
                      .includes(user.id.toString())
                  ) {
                    foundCloser = usuariosData.data.find(
                      (u) => u.id.toString() === asignacion.id_closer.toString()
                    );
                    if (foundCloser) {
                      const clienteFound = clienteAsignacionData[
                        "Clientes-closers-setters"
                      ].find((cliAsig) => {
                        return cliAsig.closers_ids.some(
                          (closerId) =>
                            closerId.toString() === foundCloser.id.toString()
                        );
                      });
                      if (clienteFound) {
                        const clienteInfo = usuariosData.data.find(
                          (u) =>
                            u.id.toString() ===
                            clienteFound.cliente_id.toString()
                        );
                        setClienteAsignado(clienteInfo);
                      }
                    }
                    break;
                  }
                } catch (e) {
                  console.error("Error al parsear setters_ids:", e);
                }
              }
            }
          }
          setCloserAsignado(foundCloser);
        }
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(
          "No se pudieron cargar tus asignaciones. Inténtalo de nuevo más tarde."
        );
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, [user]);

  const getContacto = (id) => {
    return contactos.find(
      (contacto) => contacto.id.toString() === id.toString()
    );
  };

  const filterContactos = (contactos, term) => {
    if (!term) return contactos;
    const lowercasedTerm = term.toLowerCase();
    return contactos.filter(contacto =>
      (contacto.nombre && contacto.nombre.toLowerCase().includes(lowercasedTerm)) ||
      (contacto.apellido && contacto.apellido.toLowerCase().includes(lowercasedTerm)) ||
      (contacto.correo && contacto.correo.toLowerCase().includes(lowercasedTerm))
    );
  };

  const closersAsignados = asignacionesCliente.closers_ids
    .map(getContacto)
    .filter(Boolean);
  const settersAsignados = asignacionesCliente.setters_ids
    .map(getContacto)
    .filter(Boolean);

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
      setSelectedClosers((prev) => ({
        ...prev,
        [setterId]: currentSelections,
      }));
    }
  };

  const handleOpenCorreo = (id) => {
    setContactoParaCorreo(id);
    setOpenCorreoFlotante(true);
  };

  const handleCloseCorreo = () => {
    setOpenCorreoFlotante(false);
    setContactoParaCorreo(null);
  };

  const renderContactoCard = (contacto, tipo) => (
    <Grid item xs={12} sm={6} md={4} key={contacto.id}>
      <Card raised>
        <Box
          sx={{
            position: "relative",
            height: 150,
            backgroundColor: "#f5f5f5",
            backgroundImage: `url(${contacto.banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
          }}
        />
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: -5,
              ml: 2,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "4px solid white",
              backgroundColor: "grey.300",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {contacto.avatar ? (
              <img
                src={contacto.avatar}
                alt={`Foto de perfil de ${contacto.nombre}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 60, color: "grey.600" }} />
            )}
          </Box>
          <CardContent sx={{ ml: 2, position: "relative" }}>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {contacto.nombre} {contacto.apellido}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="text.secondary" sx={{ mr: 1 }}>
                    {tipo}
                </Typography>
                <IconButton
                    aria-label="contactar por correo"
                    onClick={() => handleOpenCorreo(contacto.id)}
                    sx={{
                        color: "primary.main",
                        p: 0.5,
                    }}
                >
                    <MailOutlineIcon />
                </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, overflowWrap: "break-word" }}>
              Correo: {contacto.correo}
            </Typography>
            <Typography variant="body2">Teléfono: {contacto.telefono}</Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Paper
          elevation={4}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            p: 1,
            mb: 4,
            backgroundColor: "#ffff"
          }}
        >
          <TextField
            label="Buscar miembro del equipo"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Paper>

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
            {(user.id_tipo === 3 || user.id_tipo === 2) && (
              <>
                <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                  Cliente Asignado
                </Typography>
                <Grid container spacing={3}>
                  {clienteAsignado ? (
                    renderContactoCard(clienteAsignado, "Cliente")
                  ) : (
                    <Grid item xs={12}>
                      <Typography>No tienes un cliente asignado.</Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {(user.id_tipo === 4 || user.id_tipo === 2) && (
              <>
                <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                  Closers Asignados
                </Typography>
                <Grid container spacing={3}>
                  {user.id_tipo === 4 ? (
                    closersFiltrados.length > 0 ? (
                      closersFiltrados.map((closer) =>
                        renderContactoCard(closer, "Closer")
                      )
                    ) : (
                      <Grid item xs={12}>
                        <Typography>No tienes closers asignados.</Typography>
                      </Grid>
                    )
                  ) : closerAsignado ? (
                    renderContactoCard(closerAsignado, "Closer")
                  ) : (
                    <Grid item xs={12}>
                      <Typography>No tienes un closer asignado.</Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {(user.id_tipo === 4 || user.id_tipo === 3) && (
              <>
                <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                  Setters Asignados
                </Typography>
                <Grid container spacing={3}>
                  {settersFiltrados.length > 0 ? (
                    settersFiltrados.map((setter) => (
                      <Grid item xs={12} sm={6} md={4} key={setter.id}>
                        <Card raised>
                          <Box
                            sx={{
                              position: "relative",
                              height: 150,
                              backgroundColor: "#f5f5f5",
                              backgroundImage: `url(${setter.banner})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "100%",
                            }}
                          />
                          <Box sx={{ position: "relative" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                mt: -5,
                                ml: 2,
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                border: "4px solid white",
                                backgroundColor: "grey.300",
                                overflow: "hidden",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {setter.avatar ? (
                                <img
                                  src={setter.avatar}
                                  alt={`Foto de perfil de ${setter.nombre}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <PersonIcon sx={{ fontSize: 60, color: "grey.600" }} />
                              )}
                            </Box>
                            <CardContent
                              sx={{ ml: 2, position: "relative" }}
                            >
                              <Typography variant="h6">
                                {setter.nombre} {setter.apellido}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography color="text.secondary" sx={{ mr: 1 }}>
                                    Setter
                                </Typography>
                                <IconButton
                                    aria-label="contactar por correo"
                                    onClick={() => handleOpenCorreo(setter.id)}
                                    sx={{
                                        color: "primary.main",
                                        p: 0.5,
                                    }}
                                >
                                    <MailOutlineIcon />
                                </IconButton>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ mt: 1, overflowWrap: "break-word" }}
                              >
                                Correo: {setter.correo}
                              </Typography>
                              <Typography variant="body2">
                                Teléfono: {setter.telefono}
                              </Typography>

                              {user.id_tipo === 4 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    Closers asignados:
                                  </Typography>
                                  {selectedClosers[setter.id] &&
                                  selectedClosers[setter.id].length > 0 ? (
                                    selectedClosers[setter.id].map(
                                      (closerId) => {
                                        const closer = getContacto(closerId);
                                        return (
                                          closer && (
                                            <Typography key={closerId} variant="body2">
                                              - {closer.nombre} {closer.apellido}
                                            </Typography>
                                          )
                                        );
                                      }
                                    )
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      No hay closers asignados.
                                    </Typography>
                                  )}
                                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <Select
                                      multiple
                                      value={selectedClosers[setter.id] || []}
                                      onChange={(event) =>
                                        handleCloserChange(setter.id, event)
                                      }
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
                                          <Checkbox
                                            checked={(
                                              selectedClosers[setter.id] || []
                                            ).includes(closer.id.toString())}
                                          />
                                          <ListItemText
                                            primary={`${closer.nombre} ${closer.apellido}`}
                                          />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                              )}
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography>No tienes setters asignados.</Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Box>
        )}
      </Box>
      <CorreoFlotanteUsuarios
        open={openCorreoFlotante}
        onClose={handleCloseCorreo}
        usuarioId={contactoParaCorreo}
      />
    </Layout>
  );
};

export default MisAsignacionesCards;