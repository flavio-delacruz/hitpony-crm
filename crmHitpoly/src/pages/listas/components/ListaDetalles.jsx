// src/pages/listas/ListaDetalles.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "../../../components/layout/layout";
import { Typography, Button } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/tables/userDataTable/ReusableTable";
import CreateList from "../../../components/tables/userDataTable/components/CreateList";
import Swal from "sweetalert2";

const columns = [
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "apellido", headerName: "Apellido", width: 150 },
  { field: "celular", headerName: "Celular", width: 130 },
  { field: "correo", headerName: "Correo", width: 250 },
  { field: "estado_contacto", headerName: "Estado", width: 150 },
  { field: "ciudad", headerName: "Ciudad", width: 150 },
  { field: "sector", headerName: "Sector", width: 150 },
  { field: "productos_interes", headerName: "Intereses", width: 200 },
  { field: "nombrePropietario", headerName: "Propietario", width: 200 },
];

function ListaDetalles() {
  const { nombreLista } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const listaSeleccionada = state?.listaSeleccionada;

  // Estados de datos
  const [prospectos, setProspectos] = useState(() => {
    try {
      const localData = localStorage.getItem("prospectos");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });
  const [users, setUsers] = useState([]);
  const [listProspectsIds, setListProspectsIds] = useState([]);

  // Estados de UI y control de carga
  const [loadingProspectos, setLoadingProspectos] = useState(false);
  const [errorProspectos, setErrorProspectos] = useState(null);
  const [selectedProspectIds, setSelectedProspectIds] = useState([]);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const isFetchingUsers = useRef(false);

  // Formato del nombre de la lista para la visualización
  const formattedName = nombreLista.replace(/-(\d+)$/, "").replace(/-/g, " ");
  const displayNombreLista = formattedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Función para obtener los IDs de los prospectos de la lista
  const fetchProspectIdsFromList = useCallback(async () => {
    if (!listaSeleccionada?.id) {
      setErrorProspectos("No se encontró el ID de la lista.");
      return;
    }
    setLoadingProspectos(true);
    setErrorProspectos(null);

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosPorListaIdController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "getProspectosIds",
            id_lista: listaSeleccionada.id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setListProspectsIds(data.data);
      } else {
        setListProspectsIds([]);
      }
    } catch (error) {
      setListProspectsIds([]);
      setErrorProspectos("Error al obtener los prospectos de la lista.");
    } finally {
      setLoadingProspectos(false);
    }
  }, [listaSeleccionada]);

  // Función para obtener todos los usuarios
  const fetchAllUsers = useCallback(async () => {
    if (isFetchingUsers.current) return;
    isFetchingUsers.current = true;
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "getDataUsuarios" }),
        }
      );
      const data = await response.json();
      if (data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      isFetchingUsers.current = false;
    }
  }, []);

  useEffect(() => {
    fetchProspectIdsFromList();
    fetchAllUsers();
  }, [fetchProspectIdsFromList, fetchAllUsers]);

  // Prepara un mapa de usuarios para un acceso rápido
  const usersMap = {};
  users.forEach((u) => {
    usersMap[u.id] = u;
  });

  // Filtra y enriquece los datos de los prospectos para la tabla
  const filteredProspectos = listProspectsIds.length > 0
    ? prospectos.filter((prospecto) => listProspectsIds.includes(Number(prospecto.id)))
    : [];

  const finalProspectos = filteredProspectos.map((item) => {
    const propietario = usersMap[item.usuario_master_id];
    const nombreCompletoPropietario = propietario
      ? `${propietario.nombre} ${propietario.apellido}`
      : "Desconocido";

    return {
      ...item,
      nombrePropietario: nombreCompletoPropietario,
    };
  });


  // Manejadores de eventos de la tabla
  const handleRowSelectionChange = (newSelectionModel) => {
    setSelectedProspectIds(newSelectionModel);
  };

  const handleEnviarCorreoClick = () => {
    if (selectedProspectIds.length > 0) {
      navigate("/enviar-correo", { state: { selectedProspectIds } });
    } else {
      Swal.fire("Advertencia", "Por favor, selecciona al menos un prospecto.", "warning");
    }
  };

  const handleDeleteProspectsClick = async () => {
    if (selectedProspectIds.length === 0) {
      Swal.fire("Advertencia", "Por favor, selecciona al menos un prospecto para eliminar.", "warning");
      return;
    }
    if (!listaSeleccionada || !listaSeleccionada.id) {
      Swal.fire("Error", "No se encontró el ID de la lista.", "error");
      return;
    }
    if (
      (await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar ${selectedProspectIds.length} prospectos de esta lista?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })).isConfirmed
    ) {
      const prevListProspectsIds = [...listProspectsIds];
      setListProspectsIds((currentIds) =>
        currentIds.filter((id) => !selectedProspectIds.includes(Number(id)))
      );
      setSelectedProspectIds([]);
      try {
        const deletePromises = selectedProspectIds.map((prospectId) =>
          fetch("https://apiweb.hitpoly.com/ajax/borrarSetterListaController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accion: "BorrarSetter",
              id: prospectId,
              id_lista: listaSeleccionada.id,
            }),
          })
        );
        const results = await Promise.all(deletePromises);
        const allSucceeded = results.every((response) => response.ok);
        if (!allSucceeded) {
          setListProspectsIds(prevListProspectsIds);
          Swal.fire("Error", "Hubo un error al eliminar uno o más prospectos. La lista se ha restaurado.", "error");
        } else {
          Swal.fire("Eliminados", "Los prospectos se han eliminado con éxito.", "success");
        }
      } catch (error) {
        setListProspectsIds(prevListProspectsIds);
        Swal.fire("Error de conexión", "Hubo un error de conexión, la lista se ha restaurado.", "error");
      }
    }
  };

  const handleRowClick = (params) => {
    const prospecto = params.row;
    if (prospecto && prospecto.id && prospecto.nombre && prospecto.apellido) {
      const slug = `${prospecto.nombre
        .toLowerCase()
        .replace(/\s+/g, "-")}-${prospecto.apellido
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigate(`/pagina-de-contacto/${slug}-${prospecto.id}`);
    }
  };

  const handleMoveToListClick = () => {
    setIsCreateListModalOpen(true);
  };

  const handleMoveSuccess = async () => {
    if (!listaSeleccionada || !listaSeleccionada.id) return;
    try {
      const deletePromises = selectedProspectIds.map((prospectId) =>
        fetch("https://apiweb.hitpoly.com/ajax/borrarSetterListaController.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "BorrarSetter",
            id: prospectId,
            id_lista: listaSeleccionada.id,
          }),
        })
      );
      const results = await Promise.all(deletePromises);
      const allDeletionsSucceeded = results.every((response) => response.ok);
      if (!allDeletionsSucceeded) {
        Swal.fire("Error", "Los prospectos se agregaron a la nueva lista pero no se pudieron eliminar de la lista original.", "error");
      } else {
        Swal.fire("¡Movido!", "Los prospectos se han movido con éxito a la nueva lista.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión al intentar eliminar los prospectos de la lista original.", "error");
    } finally {
      setSelectedProspectIds([]);
      fetchProspectIdsFromList();
    }
  };

  return (
    <Layout title={`${displayNombreLista}`}>
      <div style={{ width: "100%" }}>
        <ReusableTable
          rows={finalProspectos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          {selectedProspectIds.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnviarCorreoClick}
              >
                Enviar Correo a Seleccionados
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleMoveToListClick}
              >
                Mover a Otra Lista
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteProspectsClick}
              >
                Eliminar Seleccionados
              </Button>
            </>
          )}
        </div>
      </div>
      <CreateList
        open={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        prospectosSeleccionados={selectedProspectIds}
        onListCreated={handleMoveSuccess}
        excludeListId={listaSeleccionada?.id} // ✅ Agregando la prop aquí
      />
    </Layout>
  );
}

export default ListaDetalles;