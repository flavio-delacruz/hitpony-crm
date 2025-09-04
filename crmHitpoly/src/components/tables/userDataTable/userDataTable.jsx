// DataTable.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import Stack from "@mui/material/Stack";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { columns as defaultColumns } from "./components/columns";
import CreateList from "./components/CreateList";
import Swal from "sweetalert2";
import ProspectFilter from "./components/Filter";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddModal from "../../modals/addModal/addModal";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';
import ShareLinkModal from "../../forms/clientesPotenciales/ShareLinkModal";

const googleBlue = "#4285F4";

function DataTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [prospectos, setProspectos] = useState(() => {
    try {
      const localData = localStorage.getItem("prospectos");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    estado_contacto: !isMobile,
  });

  const mobileColumns = [
    {
      field: 'nombreCompleto',
      headerName: 'Prospecto',
      flex: 1,
      valueGetter: (value, row) => `${row.nombreProspecto || ''} ${row.apellido || ''}`,
    },
    {
      field: 'estado_contacto',
      headerName: 'Estado',
      width: 150,
    },
  ];

  const columnsToShow = isMobile ? mobileColumns : defaultColumns;

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

      const usersResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerUsuariosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "getDataUsuarios" }),
      });
      const usersData = await usersResponse.json();

      const usersMap = {};
      if (usersData.data) {
        usersData.data.forEach(u => {
          usersMap[u.id] = u;
        });
      }

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

      const nuevosProspectosFormatted = finalProspects.map((item) => {
        const propietario = usersMap[item.usuario_master_id];
        const nombreCompletoPropietario = propietario ? `${propietario.nombre} ${propietario.apellido}` : 'Desconocido';

        return {
          id: item.id,
          nombreProspecto: item.nombre,
          ...item,
          nombrePropietario: nombreCompletoPropietario,
          estado: item.estado_contacto || 'Sin estado',
        };
      });

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
      {isMobile && (
        <Stack direction="row" spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareForm}
            sx={{ flex: 1 }}
          >
            Formularios
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddNew}
            sx={{ flex: 1 }}
          >
            Añadir
          </Button>
        </Stack>
      )}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%', }}
      >
        <ProspectFilter
          columns={columnsToShow}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          rows={prospectos}
          sx={{ flexGrow: 1 }}
        />
        {!isMobile && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareForm}
            >
              Formularios
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
            >
              Añadir
            </Button>
          </Stack>
        )}
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
          columns={columnsToShow}
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
          columnVisibilityModel={columnVisibilityModel}
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
      <AddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newUser) => {
          setIsAddModalOpen(false);
        }}
      />
      <ShareLinkModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </Stack>
  );
}

export default DataTable;