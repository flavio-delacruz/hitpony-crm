import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Layout from "../../components/layout/layout";
import TraerListas from "./components/TraerListas";
import EditarLista from "./components/EditarLista";
import EliminarLista from "./components/EliminarLista";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import "moment/locale/es";
import { useProspectos } from "../../context/ProspectosContext";
import { motion } from "framer-motion";

// Título estilo dashboard
import "@fontsource/montserrat/900.css";

// Paleta clara
import { PALETA } from "../../theme/paleta";

/* =========================
   Contenedor con borde degradado (modo claro)
========================= */
const NeonCard = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 22 }}
    sx={{
      position: "relative",
      borderRadius: 14,
      overflow: "hidden",
      background: PALETA.white,
      border: `1px solid ${PALETA.border}`,
      boxShadow: PALETA.shadow,
      ...sx,
    }}
  >
    {/* Borde degradado animado (suave) */}
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        p: "1px",
        background: PALETA.gradEdgeSoft,
        backgroundSize: "220% 220%",
        opacity: 0.9,
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* Shimmer sutil */}
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Box
        component={motion.div}
        initial={false}
        whileHover={{ x: ["-120%", "120%"] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          transform: "skewX(-20deg)",
          background:
            "linear-gradient(120deg, transparent 0, rgba(0,194,255,.12) 20%, transparent 40%)",
        }}
      />
    </Box>

    {children}
  </Box>
);

/* =========================
   Componente principal
========================= */
function Listas() {
  const { user } = useAuth();
  const [userLists, setUserLists] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Prospectos globales
  const { prospectos: allUserProspects, loadingProspectos } = useProspectos();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    moment.locale("es");
  }, []);

  const handleNombreGuardado = (listId, nuevoNombre) => {
    setUserLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId ? { ...list, nombre_lista: nuevoNombre } : list
      )
    );
    setEditingId(null);
    handleCloseMenu();
  };

  const handleEditarNombre = (list) => {
    setEditingId(list.id);
    handleCloseMenu();
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleListaEliminada = (listId) => {
    setUserLists((currentLists) =>
      currentLists.filter((list) => list.id !== listId)
    );
    handleCloseMenu();
  };

  const getContactosCount = (list) => {
    if (!list.prospectos || !Array.isArray(list.prospectos) || !allUserProspects) return 0;
    const listProspectIds = new Set(list.prospectos.map(String));
    return allUserProspects.filter((p) => listProspectIds.has(String(p.id))).length;
  };

  const generarUrlAmigable = (nombre, id) =>
    `${nombre.toLowerCase().replace(/ /g, "-")}-${id}`;

  const handleOpenMenu = (event, list) => {
    setAnchorEl(event.currentTarget);
    setCurrentList(list);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentList(null);
  };

  return (
    <Layout title={"Listas"}>
      {/* ===== TÍTULO igual al dashboard ===== */}
      <Stack sx={{ mt: 1, mb: 1.5 }}>
        <Typography
          component="div"
          sx={{
            fontFamily:
              "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: ".02em",
            lineHeight: 1.05,
            fontSize: { xs: 40, sm: 56 },
          }}
        >
          {"Listas".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 240, damping: 18 }}
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow:
                  "0 0 10px rgba(108,77,226,.20), 0 0 12px rgba(11,141,181,.18)",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </Typography>
      </Stack>

      <NeonCard sx={{ mt: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "14px",
            background: PALETA.white,
            color: PALETA.text,
          }}
        >
          {/* Subtítulo / descripción */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: ".02em",
                color: PALETA.text,
              }}
            >
              Listas de Prospectos
            </Typography>
          </Box>

          {/* Loader */}
          {loadingProspectos && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: PALETA.sky }} />
              <Typography variant="body1" sx={{ color: PALETA.cyan }}>
                Cargando prospectos...
              </Typography>
            </Box>
          )}

          {/* Tabla */}
          {!loadingProspectos && userLists.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                background: "transparent",
                borderRadius: 2,
                color: PALETA.text,
              }}
            >
              <Table aria-label="tabla listas">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        color: PALETA.text,
                        borderBottom: `1px solid ${PALETA.border}`,
                        fontWeight: 800,
                      },
                    }}
                  >
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Tamaño</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userLists.map((list) => {
                    const isEditing = editingId === list.id;
                    return (
                      <TableRow
                        key={list.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        whileHover={{
                          scale: 1.004,
                          backgroundColor: "rgba(255,255,255,0)",
                        }}
                        sx={{
                          "& td": {
                            color: PALETA.text,
                            borderBottom: `1px solid ${PALETA.borderSoft}`,
                          },
                          position: "relative",
                          overflow: "hidden",
                          "&:hover::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            background:
                              "linear-gradient(180deg,#00C2FF,#0B8DB5 70%,#6C4DE2)",
                            boxShadow: "0 0 14px rgba(0,194,255,.25)",
                          },
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, rgba(0,194,255,.08), rgba(108,77,226,.08))",
                          },
                          borderRadius: 8,
                        }}
                      >
                        {isEditing ? (
                          <TableCell colSpan={3}>
                            <EditarLista
                              lista={list}
                              onNombreGuardado={handleNombreGuardado}
                              onCancelEdit={handleCancelEdit}
                            />
                          </TableCell>
                        ) : (
                          <>
                            <TableCell component="th" scope="row">
                              <Link
                                to={`/listas/${generarUrlAmigable(
                                  list.nombre_lista,
                                  list.id
                                )}`}
                                state={{ listaSeleccionada: list }}
                                style={{
                                  textDecoration: "none",
                                  color: PALETA.text,
                                  cursor: "pointer",
                                  fontWeight: 800,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = PALETA.sky;
                                  e.currentTarget.style.textShadow =
                                    "0 0 10px rgba(0,194,255,.45)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = PALETA.text;
                                  e.currentTarget.style.textShadow = "none";
                                }}
                              >
                                {list.nombre_lista}
                              </Link>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 900 }} align="center">
                              {getContactosCount(list)}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                aria-label="más"
                                onClick={(event) => handleOpenMenu(event, list)}
                                sx={{
                                  color: PALETA.text,
                                  "&:hover": { color: PALETA.purple },
                                  transition: "color .2s ease",
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            !loadingProspectos && (
              <Typography sx={{ color: PALETA.cyan }}>
                No hay listas disponibles.
              </Typography>
            )
          )}

          {/* Menu acciones */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                background: PALETA.white,
                color: PALETA.text,
                border: `1px solid ${PALETA.border}`,
                boxShadow: "0 20px 40px rgba(33,30,38,.15)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleEditarNombre(currentList)}
              sx={{
                "&:hover": {
                  background: "rgba(0,194,255,.10)",
                  color: PALETA.sky,
                },
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <EliminarLista
              listaId={currentList?.id}
              onListaEliminada={handleListaEliminada}
              onCloseMenu={handleCloseMenu}
            />
          </Menu>
        </Paper>
      </NeonCard>
      <Outlet />
    </Layout>
  );
}

export default Listas;
