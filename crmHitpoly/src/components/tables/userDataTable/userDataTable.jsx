import React, { useState, useEffect, useCallback, useRef } from "react";
import Stack from "@mui/material/Stack";
import { Button, Typography } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { columns } from "./components/columns";
import CreateList from "./components/CreateList";
import Swal from "sweetalert2";
import ProspectFilter from "./components/Filter";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
// Importamos los componentes del modal y los iconos
import AddModal from "../../modals/addModal/addModal";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';
// 🆕 Importamos el modal de compartir
import ShareLinkModal from "../../forms/clientesPotenciales/ShareLinkModal"; 

const googleBlue = "#4285F4";

function DataTable() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prospectos, setProspectos] = useState(() => {
    try {
      const localData = localStorage.getItem("prospectos");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al cargar prospectos desde localStorage", error);
      return [];
    }
  });
  const [loadingProspectos, setLoadingProspectos] = useState(false);
  const [errorProspectos, setErrorProspectos] = useState(null);
  const isCheckingForChanges = useRef(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
    quickFilterLogicOperator: "or",
  });
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // 🆕 Estados para los modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // 🆕 Nuevo estado para el modal de compartir

  const fetchAllProspects = useCallback(async () => {
    if (!user || !user.id || isCheckingForChanges.current) {
      return;
    }

    isCheckingForChanges.current = true;
    setLoadingProspectos(true);
    setErrorProspectos(null);

    try {
      let allProspects = [];
      const { id, id_tipo } = user;

      if (id_tipo === "3" || id_tipo === 3) {
        const asignacionesResponse = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accion: "get" }),
          }
        );
        const asignacionesData = await asignacionesResponse.json();

        let setterIds = [];
        if (asignacionesData.data && asignacionesData.data.length > 0) {
          const asignacionDelCloser = asignacionesData.data.find(
            (asignacion) => Number(asignacion.id_closer) === Number(id)
          );
          if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
            try {
              const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
              if (Array.isArray(parsedSetters)) {
                setterIds = parsedSetters;
              }
            } catch (e) {
              console.error("Error parsing setters_ids:", e);
            }
          }
        }
        const promises = setterIds.map((setterId) =>
          fetch(
            "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
            }
          ).then((res) => res.json())
        );
        const allProspectsFromSetters = await Promise.all(promises);
        allProspects = allProspectsFromSetters.flatMap(
          (data) => data.resultado || []
        );
      }

      const userProspectsResponse = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: id }),
        }
      );
      const userProspectsData = await userProspectsResponse.json();
      const prospectsFromUser = userProspectsData.resultado || [];

      const finalProspects =
        user.id_tipo === "3" || user.id_tipo === 3
          ? [...allProspects, ...prospectsFromUser]
          : prospectsFromUser;

      const nuevosProspectosFormatted = finalProspects.map((item) => ({
        id: item.id,
        ...item,
      }));

      setProspectos(nuevosProspectosFormatted);
    } catch (error) {
      setErrorProspectos("Error al cargar prospectos: " + error.message);
    } finally {
      setLoadingProspectos(false);
      isCheckingForChanges.current = false;
    }
  }, [user]);

  const deleteProspectsFromList = useCallback(
    async (prospectIds) => { 
      const previousProspects = [...prospectos];

      const updatedProspects = previousProspects.filter(
        (p) => !prospectIds.includes(p.id)
      );
      setProspectos(updatedProspects);

      try {
        const deletePromises = prospectIds.map((prospectId) => {
          const bodyData = JSON.stringify({
            funcion: "delete", 
            id: prospectId,
          });
          return fetch(
            "https://apiweb.hitpoly.com/ajax/eliminarProspectoTempController.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: bodyData,
            }
          );
        });

        const results = await Promise.all(deletePromises);

        let allSucceeded = true;
        for (const response of results) {
          const responseBody = await response.json().catch(() => ({}));
          if (!response.ok || responseBody.status === "error") {
            allSucceeded = false;
          }
        }

        if (!allSucceeded) {
          setProspectos(previousProspects);
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "Hubo un error al eliminar los prospectos. La lista se ha restaurado.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: "Los prospectos seleccionados han sido eliminados correctamente.",
          });
        }
      } catch (error) {
        console.error("Error de conexión al eliminar los prospectos:", error);
        setProspectos(previousProspects);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Hubo un error de conexión, la lista se ha restaurado.",
        });
      }
    },
    [prospectos]
  );

  useEffect(() => {
    if (user?.id) {
      fetchAllProspects();
    }
  }, [user, fetchAllProspects]);

  useEffect(() => {
    try {
      if (prospectos.length > 0) {
        localStorage.setItem("prospectos", JSON.stringify(prospectos));
      }
    } catch (error) {
      console.error("Error al guardar prospectos en localStorage", error);
    }
  }, [prospectos]);

  const handleRowSelectionChange = (newSelectionModel) => {
    setRowSelectionModel(newSelectionModel);
    setSelectedRows(newSelectionModel);
  };

  const handleCellClick = (params, event) => {};

  const handleSendMessage = () => {
    if (selectedRows.length > 0) {
      navigate("/enviar-correo", { state: { selectedProspectIds: selectedRows } });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona al menos un prospecto para enviar un correo.",
      });
    }
  };

  const handleFilterModelChange = (newFilterModel) => {
    setFilterModel(newFilterModel);
  };

  const handleOpenCreateList = () => {
    setIsCreateListOpen(true);
  };

  const handleCloseCreateList = () => {
    setIsCreateListOpen(false);
  };

  const handleListCreated = () => {};

  const handleDeleteSelected = async () => {
    if (selectedRows.length > 0) {
      if (
        window.confirm(
          `¿Estás seguro de que quieres eliminar ${selectedRows.length} prospectos?`
        )
      ) {
        await deleteProspectsFromList(selectedRows);
        setSelectedRows([]);
        setRowSelectionModel([]);
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

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // 🆕 La nueva función que abre el modal de compartir
  const handleShareForm = () => {
    setIsShareModalOpen(true);
  };

  if (loadingProspectos) {
    return <Typography>Cargando prospectos...</Typography>;
  }

  if (errorProspectos) {
    return <Typography color="error">{errorProspectos}</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
      >
        <ProspectFilter
          columns={columns}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          rows={prospectos}
        />
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />} 
            onClick={handleShareForm}
          >
            Compartir Formulario
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />} 
            onClick={handleAddNew}
          >
            Añadir Nuevo Prospecto
          </Button>
        </Stack> 
      </Stack>
      {selectedRows.length > 0 && (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateList}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Crear Lista
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteSelected}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Eliminar Seleccionados
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleSendMessage}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Enviar Correo
          </Button>
        </Stack>
      )}
      <Paper
        sx={{
          height: "80vh",
          width: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={prospectos}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 50, 100]}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelectionChange}
          rowSelectionModel={rowSelectionModel}
          onCellClick={handleCellClick}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          onRowClick={handleRowClick}
          sx={{
            fontWeight: "bold",
            "& .MuiDataGrid-cell": {
              cursor: "pointer",
              transition: "color 0.3s",
            },
            "& .MuiDataGrid-cell:hover": {
              color: googleBlue,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            border: "none",
          }}
        />
      </Paper>
      {isCreateListOpen && (
        <CreateList
          open={isCreateListOpen}
          onClose={handleCloseCreateList}
          prospectosSeleccionados={selectedRows}
          onListCreated={handleListCreated}
        />
      )}
      {/* Agregamos el AddModal aquí */}
      <AddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newUser) => {
          console.log("Nuevo usuario guardado:", newUser);
          setIsAddModalOpen(false);
        }}
      />
      {/* 🆕 Renderizamos el nuevo modal de compartir aquí */}
      <ShareLinkModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </Stack>
  );
}

export default DataTable;