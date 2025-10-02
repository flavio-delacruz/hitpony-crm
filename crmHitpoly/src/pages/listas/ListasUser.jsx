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

/* =========================
   Paleta / helpers
========================= */
const ui = {
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  pink: "#FF2D75",
  purple: "#6C4DE2",
  text: "#E8ECF1",
  sub: "#A7B1C1",
  panel: "#0b0f14",
  rowHover: "linear-gradient(90deg, rgba(0,234,240,.08), rgba(255,45,117,.08))",
};

/* =========================
   Contenedor con borde neón + shimmer
========================= */
const NeonCard = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ y: 12, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 220, damping: 24 }}
    sx={{ position: "relative", borderRadius: 14, overflow: "hidden", ...sx }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        p: "1px",
        background:
          "linear-gradient(120deg,#00EAF0,#0B8DB5 40%,#FF2D75 85%,#00EAF0)",
        backgroundSize: "200% 200%",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
        animation: "borderFlow 9s linear infinite",
      }}
    />
    {/* shimmer sutil */}
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
            "linear-gradient(120deg, transparent 0, rgba(255,255,255,.08) 20%, transparent 40%)",
        }}
      />
    </Box>
    {children}
    <style>{`
      @keyframes borderFlow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
    `}</style>
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
      <NeonCard
        sx={{
          mt: 2,
          background: ui.panel,
          boxShadow: "0 18px 50px rgba(0,0,0,.55)",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "14px",
            background: ui.panel,
            color: ui.text,
          }}
        >
          {/* Título con tipografía y glow neon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography component="div" sx={{ fontWeight: 900 }}>
              {"Listas de Prospectos".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.02,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  style={{
                    display: "inline-block",
                    fontFamily: "'Gravitas One', serif",
                    fontSize: 26,
                    letterSpacing: ".02em",
                    textShadow:
                      "0 1px 0 rgba(0,0,0,.25), 0 0 18px rgba(11,141,181,.45), 0 0 12px rgba(255,45,117,.35)",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
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
              <CircularProgress sx={{ color: ui.cyan }} />
              <Typography variant="body1" sx={{ color: ui.sub }}>
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
                color: ui.text,
              }}
            >
              <Table aria-label="tabla listas">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        color: ui.text,
                        borderBottom: "1px solid rgba(255,255,255,.08)",
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
                            color: ui.text,
                            borderBottom: "1px solid rgba(255,255,255,.06)",
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
                              "linear-gradient(180deg,#00EAF0,#0B8DB5 70%,#FF2D75)",
                            boxShadow: "0 0 14px rgba(255,45,117,.35)",
                          },
                          "&:hover": {
                            background: ui.rowHover,
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
                                  color: ui.text,
                                  cursor: "pointer",
                                  fontWeight: 800,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = ui.cyan;
                                  e.currentTarget.style.textShadow =
                                    "0 0 10px rgba(0,234,240,.6)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = ui.text;
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
                                  color: ui.text,
                                  "&:hover": { color: ui.pink },
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
              <Typography sx={{ color: ui.sub }}>
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
                background: ui.panel,
                color: ui.text,
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(0,234,240,.12)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleEditarNombre(currentList)}
              sx={{
                "&:hover": {
                  background: "rgba(0,234,240,.08)",
                  color: ui.cyan,
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
