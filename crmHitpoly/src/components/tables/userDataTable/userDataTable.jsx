import React, { useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import {
  Box, // Necesario para envolver el filtro y la barra de búsqueda si se usa
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton, // Necesario para el toggle de tema si se usa solo el ícono
} from "@mui/material";
import { alpha } from "@mui/material/styles"; // Necesario para los gradientes y sombras
import { useAuth } from "../../../context/AuthContext";
import { useProspectos } from "../../../context/ProspectosContext";
import { useNavigate } from "react-router-dom";
import { columns as defaultColumns } from "./components/columns"; 
import CreateList from "./components/CreateList";
import Swal from "sweetalert2";
import ProspectFilter from "./components/Filter";
import { DataGrid } from "@mui/x-data-grid";
import AddModal from "../../modals/addModal/addModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShareIcon from "@mui/icons-material/Share";
import ShareLinkModal from "../../forms/clientesPotenciales/ShareLinkModal";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadOptions from "./components/DownloadOptions";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"; // Se cambian los íconos por los Outline para coincidir con el diseño
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

// ====================================================================
// PALETAS DE COLORES Y ESTILOS DE GRADIENTE (Reimplementados)
// ====================================================================

// Colores del gradiente global
const CYAN = "#00EAF0";
const BLUE = "#0B8DB5";
const PURPLE = "#6C4DE2";
const PINK = "#FF2D75";

const PALETTES = {
  dark: {
    // Modo Oscuro: TODO NEGRO PURO
    shellBg: "#000000",
    panel: "#000000",
    tableBg: "#000000",
    text: "#E7E9EE",
    textMuted: "#AAB0C0",
    textDark: "#0d1117", // Para texto oscuro sobre gradiente claro
    // Gradiente de encabezado de tabla mejorado para negro
    headerGrad: `linear-gradient(90deg,
      rgba(0,234,240,.20) 0%,
      rgba(108,77,226,.20) 50%,
      rgba(255,45,117,.20) 100%)`,
    rowHover: "rgba(255,255,255,.05)",
    rowSelected: "rgba(108,77,226,.22)",
    rowSelectedHover: "rgba(108,77,226,.28)",
    divider: "rgba(255,255,255,.08)", 
    checkbox: "rgba(0,234,240,.9)",
  },
  light: {
    // Modo Claro: TODO BLANCO PURO/GRIS CLARO
    shellBg: "#f7f7f7", // Fondo principal gris claro (como en image_1734b0.png)
    panel: "#FFFFFF",
    tableBg: "#FFFFFF",
    text: "#0d1117",
    textMuted: "#6b7280",
    textDark: "#FFFFFF", // Para texto blanco sobre gradiente claro
    headerGrad: "linear-gradient(90deg,#EAF6FF,#F9E8F1)",
    rowHover: "rgba(0,0,0,.04)",
    rowSelected: "rgba(108,77,226,.16)",
    rowSelectedHover: "rgba(108,77,226,.22)",
    divider: "rgba(0,0,0,.08)",
    checkbox: "#334155",
  },
};

// Estilo de botón/pastilla con gradiente de fondo (Añadir, Nombres Activo)
const makeContainedGrad = (ui) => ({
  borderRadius: 999,
  px: 2.2,
  fontWeight: 700,
  letterSpacing: ".02em",
  color: ui.textDark, // Blanco o negro, según el tema
  boxShadow: `0 10px 24px ${alpha("#000", 0.25)}, 0 8px 24px ${alpha(
    BLUE,
    0.25
  )}`,
  background: `linear-gradient(90deg, ${CYAN} 0%, ${BLUE} 45%, ${PINK} 100%)`,
  "&:hover": {
    filter: "brightness(1.05)",
    boxShadow: `0 14px 34px ${alpha("#000", 0.35)}, 0 10px 34px ${alpha(
      BLUE,
      0.35
    )}`,
  },
});

// Estilo de botón/pastilla con gradiente de borde (Descargar, Formularios, Filtros Inactivos)
const makeOutlinedGrad = (ui) => ({
  borderRadius: 999,
  px: 2.2,
  fontWeight: 700,
  letterSpacing: ".02em",
  color: ui.text, // Color de texto normal
  border: "1px solid transparent",
  background: `
    linear-gradient(${ui.panel}, ${ui.panel}) padding-box,
    linear-gradient(90deg, ${CYAN}, ${PURPLE} 60%, ${PINK}) border-box`,
  "&:hover": {
    color: PINK,
    background: `
      linear-gradient(${alpha(ui.panel, 0.85)}, ${alpha(
      ui.panel,
      0.85
    )}) padding-box,
      linear-gradient(90deg, ${CYAN}, ${PURPLE} 60%, ${PINK}) border-box`,
    filter: "brightness(1.05)",
  },
});

// Estilo de pastilla de filtro activa
const makeActiveFilterPill = (ui) => ({
  ...makeContainedGrad(ui), // Reutilizamos el estilo de ContainedGrad
  background: `linear-gradient(90deg, ${CYAN} 0%, ${PURPLE} 100%)`,
  boxShadow: `0 4px 10px ${alpha(PURPLE, 0.4)}`,
  "&:hover": {
    filter: "brightness(1.1)",
    background: `linear-gradient(90deg, ${CYAN} 0%, ${PURPLE} 100%)`,
  },
});

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

  // === TEMA Y ESTILOS ===
  const [darkMode, setDarkMode] = useState(true); 
  const toggleTheme = () => setDarkMode((p) => !p);

  const mode = darkMode ? "dark" : "light";
  const ui = mode === "dark" ? PALETTES.dark : PALETTES.light;
  const containedGrad = makeContainedGrad(ui);
  const outlinedGrad = makeOutlinedGrad(ui);
  const activeFilterPill = makeActiveFilterPill(ui);

  // Estado para manejar la pastilla de filtro activa
  const [activeFilterPillId, setActiveFilterPillId] = useState("Nombres");
  const handlePillClick = (id) => setActiveFilterPillId(id);

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
  const [columnVisibilityModel] = useState({ estado_contacto: !isMobile });
  const [anchorEl, setAnchorEl] = useState(null);

  // ... (mobileColumns y desktopColumns se mantienen iguales)
  const mobileColumns = [
    {
      field: "nombreCompleto",
      headerName: "Prospecto",
      flex: 1,
      valueGetter: (value, row) => `${row.nombre || ""} ${row.apellido || ""}`,
    },
    { field: "estado_contacto", headerName: "Estado", width: 150 },
    { field: "nombrePropietario", headerName: "Propietario", flex: 1 },
  ];
  const desktopColumns = useMemo(() => {
    const nombreCompletoColumn = {
      field: "nombreCompleto",
      headerName: "Nombre Completo",
      hide: true,
      valueGetter: (value, row) => `${row.nombre || ""} ${row.apellido || ""}`,
    };
    return [nombreCompletoColumn, ...defaultColumns];
  }, []);
  const columnsToShow = isMobile ? mobileColumns : desktopColumns;

  // ... (handleRowSelectionChange, handleSendMessage, etc. se mantienen iguales)
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
  const handleOpenCreateList = () => setIsCreateListOpen(true);
  const handleCloseCreateList = () => setIsCreateListOpen(false);
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
  const handleAddNew = () => setIsAddModalOpen(true);
  const handleShareForm = () => setIsShareModalOpen(true);
  const handleOpenDownloadMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseDownloadMenu = () => setAnchorEl(null);

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
    <Stack
      spacing={2}
      sx={{
        // Fondo de TODA la pestaña / página (Negro Puro o Gris Claro)
        bgcolor: ui.shellBg,
        color: ui.text,
        minHeight: "100vh",
        p: { xs: 1.5, sm: 2.5 },
        transition: "background-color .2s ease, color .2s ease",
      }}
    >
      {/* 1. FILTROS Y BOTONES DE ACCIÓN (Superior) */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        {/* GRUPO DE FILTROS (Nombres, Propiet, Estados) */}
        <Stack direction="row" spacing={1}>
          {["Nombres", "Propiet", "Estados"].map((label) => (
            <Button
              key={label}
              variant="outlined"
              onClick={() => handlePillClick(label)}
              // Aplica el gradiente completo si es activo, el outline si es inactivo
              sx={
                activeFilterPillId === label
                  ? activeFilterPill
                  : outlinedGrad
              }
            >
              {label}
            </Button>
          ))}
        </Stack>

        {/* GRUPO DE ACCIONES (Descargar, Formularios, Añadir, Tema) - SOLO ESCRITORIO */}
        {!isMobile && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleOpenDownloadMenu}
              sx={outlinedGrad}
            >
              Descargar
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareForm}
              sx={outlinedGrad}
            >
              Formularios
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
              sx={containedGrad}
            >
              Añadir
            </Button>
            {/* Botón de cambiar tema */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                ml: 1,
                borderRadius: 2,
                p: 1,
                color: mode === "dark" ? CYAN : PINK,
                border: `1px solid ${ui.divider}`,
                // Usa el fondo del panel (Negro o Blanco) con el borde de gradiente
                background: `
                    linear-gradient(${ui.panel}, ${ui.panel}) padding-box,
                    linear-gradient(90deg, ${CYAN}, ${PURPLE} 60%, ${PINK}) border-box`,
              }}
            >
              {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Stack>
        )}
      </Stack>

      {/* 2. BARRA DE BÚSQUEDA (FilterBar) */}
      <Box className="filterBar" sx={{ width: "100%", mt: 1 }}>
        <ProspectFilter
          columns={columnsToShow}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          rows={prospectos}
        />
      </Box>

      {/* 3. Mobile quick actions (debajo del filtro en móvil) */}
      {isMobile && (
        <Stack direction="row" spacing={2} sx={{ mb: 1, width: "100%" }}>
          <Button
            startIcon={<ShareIcon />}
            onClick={handleShareForm}
            sx={{ flex: 1, ...outlinedGrad }}
          >
            Formularios
          </Button>
          <Button
            startIcon={<PersonAddIcon />}
            onClick={handleAddNew}
            sx={{ flex: 1, ...containedGrad }}
          >
            Añadir
          </Button>
        </Stack>
      )}

      {/* 4. Selection actions */}
      {selectedRows.length > 0 && (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {/* Botones de acción planos, se pueden mantener o cambiar a gradiente si es necesario */}
          <Button
            variant="contained"
            onClick={handleOpenCreateList}
            sx={{ width: "fit-content", mt: 1, ...containedGrad }} // Usando gradiente
          >
            Enviar a lista
          </Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{
              width: "fit-content",
              mt: 1,
              ...containedGrad,
              background: `linear-gradient(90deg, ${BLUE}, ${PURPLE})`,
              color: ui.textDark,
            }}
          >
            Enviar Correos
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteSelected}
            sx={{
              width: "fit-content",
              mt: 1,
              ...outlinedGrad,
              color: PINK,
              background: `
                linear-gradient(${ui.shellBg}, ${ui.shellBg}) padding-box,
                linear-gradient(90deg, #ff9aa8, #ff6b81) border-box`,
            }}
          >
            Eliminar
          </Button>
        </Stack>
      )}

      {/* 5. Tabla de datos (DataGrid) */}
      <Paper
        sx={{
          height: "80vh",
          width: "auto",
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${ui.divider}`,
          // Fondo de la tabla: Negro Puro o Blanco Puro
          background: ui.tableBg, 
          boxShadow: "0 12px 30px rgba(0,0,0,.35)",
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
          onFilterModelChange={setFilterModel}
          onRowClick={handleRowClick}
          columnVisibilityModel={columnVisibilityModel}
          sx={{
            border: "none",
            color: ui.text,
            fontFamily: `'Poppins', system-ui, Segoe UI, Roboto, Arial`,
            // Encabezados con gradiente
            "& .MuiDataGrid-columnHeaders": {
              background: ui.headerGrad,
              borderBottom: `1px solid ${ui.divider}`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: mode === "dark" ? ui.text : PALETTES.light.text,
              fontWeight: 800,
              letterSpacing: ".02em",
              textTransform: "uppercase",
              fontSize: 12,
            },
            // Fondo del cuerpo de la tabla (Negro Puro o Blanco Puro)
            "& .MuiDataGrid-virtualScroller": {
              background: ui.tableBg,
            },
            "& .MuiDataGrid-row": {
              transition: "background-color .18s ease, transform .18s ease",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: ui.rowHover,
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: ui.rowSelected,
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: ui.rowSelectedHover,
            },
            "& .MuiDataGrid-cell": {
              borderBottomColor: ui.divider,
              color: ui.text,
              cursor: "pointer",
              transition: "color .2s ease",
            },
            "& .MuiDataGrid-cell:hover": {
              color: mode === "dark" ? CYAN : "#111827",
            },
            "& .MuiCheckbox-root svg": { fill: ui.checkbox },
            "& .MuiTablePagination-root, & .MuiDataGrid-selectedRowCount": {
              color: ui.text,
            },
            // Fondo del pie de página de paginación
            "& .MuiTablePagination-toolbar": {
              backgroundColor:
                mode === "dark" ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)",
            },
            "& .MuiDataGrid-overlay": {
              color: ui.text,
              fontWeight: 700,
            },
          }}
        />
      </Paper>

      {/* 6. Modals */}
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
        onSave={() => setIsAddModalOpen(false)}
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
      
      {/* Toggle visible en móvil (abajo) */}
      {isMobile && (
        <IconButton
          onClick={toggleTheme}
          sx={{
            alignSelf: "flex-end",
            borderRadius: 2,
            p: 1,
            color: mode === "dark" ? CYAN : PINK,
            border: `1px solid ${ui.divider}`,
            background: `
                linear-gradient(${ui.panel}, ${ui.panel}) padding-box,
                linear-gradient(90deg, ${CYAN}, ${PURPLE} 60%, ${PINK}) border-box`,
          }}
        >
          {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      )}

      {/* Estilos CSS para la barra de búsqueda (ajustada para el tema) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        .filterBar .MuiFormControl-root { width: 100%; }
        .filterBar .MuiOutlinedInput-root {
          color: ${ui.text};
          border-radius: 999px !important;
          padding-left: 10px;
          // Fondo del input: Negro Puro o Blanco Puro, con borde de gradiente
          background:
            linear-gradient(${ui.panel}, ${ui.panel}) padding-box,
            linear-gradient(90deg, ${CYAN}, ${PURPLE} 60%, ${PINK}) border-box;
          border: 1px solid transparent;
          box-shadow: 0 4px 14px rgba(0,0,0,.20);
        }
        .filterBar .MuiOutlinedInput-notchedOutline { border-color: transparent !important; }
        .filterBar .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color: transparent; }
        .filterBar .MuiInputLabel-root {
          color: ${ui.textMuted};
          font-weight: 600;
        }
        .filterBar .Mui-focused .MuiOutlinedInput-notchedOutline {
          box-shadow: 0 0 0 3px ${alpha(BLUE, 0.25)};
        }
        .filterBar .MuiSvgIcon-root { color: ${ui.text}; }
      `}</style>
    </Stack>
  );
}

export default DataTable;