import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, Typography } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProspectos } from "../../../context/ProspectosContext"; 
import { columns } from "./components/columns";
import CreateList from "./components/CreateList";
import Swal from "sweetalert2";
import ReusableTable from "./ReusableTable";
import ProspectFilter from "./components/Filter";

const googleBlue = "#4285F4";

function DataTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { prospectos, loadingProspectos, errorProspectos, deleteProspectsFromList } = useProspectos();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
    quickFilterLogicOperator: "or",
  });
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  const handleRowSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
  };

  const handleCellClick = (params, event) => {
    
  };

  const handleSendMessage = () => {
    if (selectedRows.length > 0) {
      navigate('/enviar-correo', { state: { selectedProspectIds: selectedRows } });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona al menos un prospecto para enviar un correo.',
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
        if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedRows.length} prospectos?`)) {
            await deleteProspectsFromList(selectedRows);
            setSelectedRows([]); 
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
    } else {
    }
  };

  if (loadingProspectos) {
    return <Typography>Cargando prospectos...</Typography>;
  }

  if (errorProspectos) {
    return <Typography color="error">{errorProspectos}</Typography>;
  }

  return (
    <Stack spacing={2}>
      <ProspectFilter
        columns={columns}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        rows={prospectos}
      />
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
      <ReusableTable
        rows={prospectos}
        columns={columns}
        onRowSelectionChange={(ids) => handleRowSelectionChange(ids)}
        onCellClick={handleCellClick}
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        onRowClick={handleRowClick}
      />
      {isCreateListOpen && (
        <CreateList
          open={isCreateListOpen}
          onClose={handleCloseCreateList}
          prospectosSeleccionados={selectedRows}
          onListCreated={handleListCreated}
        />
      )}
    </Stack>
  );
}

export default DataTable;