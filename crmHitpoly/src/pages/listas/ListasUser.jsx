import React, { useState, useEffect, useCallback } from "react";
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
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

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
  const { user } = useAuth();
  const [userLists, setUserLists] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [allUserProspects, setAllUserProspects] = useState([]);
  const [loadingProspects, setLoadingProspects] = useState(false);

  const fetchAllProspectsForUser = useCallback(async () => {
    if (!user || !user.id || !user.id_tipo) {
      return;
    }

    setLoadingProspects(true);
    try {
      let finalProspects = [];
      const { id, id_tipo } = user;

      if (id_tipo === "3" || id_tipo === 3) {
        const asignacionesResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        });
        const asignacionesData = await asignacionesResponse.json();
        
        const asignacionDelCloser = asignacionesData.data.find(asignacion => Number(asignacion.id_closer) === Number(id));
        let setterIds = [];
        if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
            const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
            if (Array.isArray(parsedSetters)) {
                setterIds = parsedSetters;
            }
        }

        const promises = setterIds.map(setterId =>
            fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
            }).then(res => res.json())
        );

        const allProspectsFromSetters = await Promise.all(promises);
        const prospectsFromSetters = allProspectsFromSetters.flatMap(data => data.resultado || []);
        finalProspects.push(...prospectsFromSetters);
      }

      const userProspectsResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "getProspectos", id: id }),
      });
      const userProspectsData = await userProspectsResponse.json();
      finalProspects.push(...(userProspectsData.resultado || []));

      const uniqueProspects = Array.from(new Map(finalProspects.map(p => [p.id, p])).values());
      const formattedProspects = uniqueProspects.map(item => ({ id: item.id, ...item }));
      
      setAllUserProspects(formattedProspects);
    } catch (error) {
      console.error("Error al cargar prospectos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Sincronización',
        text: 'Hubo un problema al obtener los prospectos. Intenta recargar la página.',
      });
    } finally {
      setLoadingProspects(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchAllProspectsForUser();
    }
  }, [user, fetchAllProspectsForUser]);

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
    if (!list.prospectos || !Array.isArray(list.prospectos)) {
      return 0;
    }
    const listProspectIds = new Set(list.prospectos.map(String));
    const count = allUserProspects.filter(prospecto =>
      listProspectIds.has(String(prospecto.id))
    ).length;
    return count;
  };

  const generarUrlAmigable = (nombre, id) => {
    return `${nombre.toLowerCase().replace(/ /g, '-')}-${id}`;
  };

  return (
    <Layout title={"Listas"}>
      <Paper sx={{ p: 2, mt: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Listas de Prospectos
          </Typography>
        </div>

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