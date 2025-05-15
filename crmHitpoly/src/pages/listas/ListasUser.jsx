// Listas.jsx
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Layout from "../../components/layout/layout";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { blueGrey } from "@mui/material/colors";
import TraerListas from "./components/TraerListas";
import EditarLista from "./components/EditarLista";
import EliminarLista from "./components/EliminarLista";
import { Link, Outlet, useOutletContext } from 'react-router-dom';

const ListaItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
}));

function Listas() {
  const [userLists, setUserLists] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleNombreGuardado = (listId, nuevoNombre) => {
    setUserLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId ? { ...list, nombre_lista: nuevoNombre } : list
      )
    );
    setEditingId(null);
  };

  const handleEditarNombre = (event, list) => {
    event.stopPropagation();
    setEditingId(list.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleListaEliminada = (listId) => {
    setUserLists((currentLists) =>
      currentLists.filter((list) => list.id !== listId)
    );
  };

  const getContactosCount = (list) => {
    return list.prospectos ? list.prospectos.length : 0;
  };

  const generarUrlAmigable = (nombre, id) => {
    return `${nombre.toLowerCase().replace(/ /g, '-')}-${id}`;
  };

  return (
    <Layout title={"Listas"}>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Listas de Prospectos
        </Typography>

        <TraerListas setListas={setUserLists} />

        {userLists.length > 0 ? (
          userLists.map((list) => (
            <ListaItem key={list.id}>
              {editingId === list.id ? (
                <EditarLista
                  lista={list}
                  onNombreGuardado={handleNombreGuardado}
                  onCancelEdit={handleCancelEdit}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Link
                    to={`/listas/${generarUrlAmigable(list.nombre_lista, list.id)}`}
                    state={{ listaSeleccionada: list }}
                    style={{
                      flexGrow: 1,
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <Typography>{list.nombre_lista}</Typography>
                  </Link>
                  <Typography style={{ fontWeight: "bold", marginRight: "16px" }}>
                    {getContactosCount(list)} contactos
                  </Typography>
                  <div>
                    <IconButton
                      onClick={(event) => handleEditarNombre(event, list)}
                      aria-label="editar"
                      sx={{ color: blueGrey[500], mx: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <EliminarLista
                      listaId={list.id}
                      onListaEliminada={handleListaEliminada}
                    />
                  </div>
                </div>
              )}
            </ListaItem>
          ))
        ) : (
          <Typography color="textSecondary">Buscando listas...</Typography>
        )}
      </Paper>
      <Outlet />
    </Layout>
  );
}

export default Listas;