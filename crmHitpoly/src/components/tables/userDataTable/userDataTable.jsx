import React, { useState, useMemo, useRef } from "react";
import Stack from "@mui/material/Stack";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useProspectos } from "../../../context/ProspectosContext";
import { useNavigate } from "react-router-dom";
import { columns as defaultColumns } from "./components/columns"; // <-- Las columnas importadas
import CreateList from "./components/CreateList";
import Swal from "sweetalert2";
import ProspectFilter from "./components/Filter";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddModal from "../../modals/addModal/addModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShareIcon from "@mui/icons-material/Share";
import ShareLinkModal from "../../forms/clientesPotenciales/ShareLinkModal";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadOptions from "./components/DownloadOptions";

const googleBlue = "#4285F4";

function DataTable() {
  const { user } = useAuth();
  const {
    prospectos,
    loadingProspectos,
    errorProspectos,
    deleteProspectsFromList,
    fetchProspectos,
  } = useProspectos();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [anchorEl, setAnchorEl] = useState(null);

  const mobileColumns = [
    {
      field: "nombreCompleto",
      headerName: "Prospecto",
      flex: 1,
      valueGetter: (value, row) =>
        `${row.nombre || ""} ${row.apellido || ""}`,
    },
    {
      field: "estado_contacto",
      headerName: "Estado",
      width: 150,
    },
    {
      field: "nombrePropietario",
      headerName: "Propietario",
      flex: 1,
    },
  ];

  // Agrega la nueva columna oculta a las columnas de escritorio.
  const desktopColumns = useMemo(() => {
    // Definimos la columna de "nombreCompleto"
    const nombreCompletoColumn = {
      field: "nombreCompleto",
      headerName: "Nombre Completo",
      // Escondemos esta columna para que no se duplique la información
      hide: true,
      valueGetter: (value, row) => `${row.nombre || ""} ${row.apellido || ""}`,
    };
    // Devolvemos un nuevo array que incluye la nueva columna y las originales
    return [nombreCompletoColumn, ...defaultColumns];
  }, [defaultColumns]);

  const columnsToShow = isMobile ? mobileColumns : desktopColumns;

  const handleRowSelectionChange = (newSelectionModel) => {
    setRowSelectionModel(newSelectionModel);
    setSelectedRows(newSelectionModel);
  };

  const handleSendMessage = () => {
    if (selectedRows.length > 0) {
      navigate("/enviar-correo", {
        state: { selectedProspectIds: selectedRows },
      });
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

  const handleListCreated = async () => {
    try {
      await Swal.fire("Éxito", "Operación completada con éxito.", "success");
    } catch (error) {
      console.error("Error al mostrar la alerta:", error);
    }
    fetchProspectos();
  };

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

  const handleOpenDownloadMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDownloadMenu = () => {
    setAnchorEl(null);
  };

  const prospectsToDownload =
    selectedRows.length > 0
      ? prospectos.filter((p) => selectedRows.includes(p.id))
      : prospectos;

  if (loadingProspectos) {
    return <Typography>Cargando prospectos...</Typography>;
  }

  if (errorProspectos) {
    return <Typography color="error">{errorProspectos}</Typography>;
  }

  return (
    <Stack spacing={2}>
      {isMobile && (
        <Stack direction="row" spacing={2} sx={{ mb: 2, width: "100%" }}>
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
        sx={{ width: "100%" }}
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
              startIcon={<DownloadIcon />}
              onClick={handleOpenDownloadMenu}
            >
              Descargar
            </Button>
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
            Enviar a lista
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleSendMessage}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Enviar Correos
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteSelected}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Eliminar
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
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleRowSelectionChange}
          rowSelectionModel={rowSelectionModel}
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

      <DownloadOptions
        anchorEl={anchorEl}
        handleClose={handleCloseDownloadMenu}
        prospectsToDownload={prospectsToDownload}
      />
    </Stack>
  );
}

export default DataTable;