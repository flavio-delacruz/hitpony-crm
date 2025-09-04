import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../components/layout/layoutAdmin";
import ProspectsTable from "./components/ProspectsTable";
import SearchProspectControl from "./components/SearchSetterControl";
import EstadoFilterControl from "./components/EstadoFilterControl";
import Swal from "sweetalert2";
import useAdminDashboardData from "./components/useAdminDashboardData";

export const estadoOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "leads", label: "Leads" },
  { value: "nutricion", label: "Nutrición" },
  { value: "interesado", label: "Interesado" },
  { value: "agendado", label: "Agendado" },
  { value: "ganado", label: "Ganado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "perdido", label: "Perdido" },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [selectedProspectIds, setSelectedProspectIds] = useState([]);

  const { data, loading, error, updateProspectoEstado } = useAdminDashboardData();
  const navigate = useNavigate();

  const handleEstadoChange = useCallback(
    async (event, prospectId) => {
      const nuevoEstado = event.target.value;
      await updateProspectoEstado({ prospectId, nuevoEstado });
    },
    [updateProspectoEstado]
  );

  const filteredData = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        (item.nombre || "").toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.apellido || "").toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.correo || "").toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.telefono || "").includes(lowerCaseSearchTerm);
      
      const matchesEstado =
        filtroEstado === "all" || item.estado_contacto === filtroEstado;
      
      return matchesSearch && matchesEstado;
    });
  }, [data, searchTerm, filtroEstado]);

  const handleSelectProspect = useCallback((id) => {
    setSelectedProspectIds((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(id);
      const newSelection = isAlreadySelected
        ? prevSelected.filter((prospectId) => prospectId !== id)
        : [...prevSelected, id];
      return newSelection;
    });
  }, []);

  const handleSelectAllProspects = useCallback((visibleProspects) => {
    const visibleIds = visibleProspects.map((p) => p.id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedProspectIds.includes(id)
    );

    setSelectedProspectIds((prevSelected) => {
      if (allVisibleSelected) {
        return prevSelected.filter((id) => !visibleIds.includes(id));
      } else {
        return [...new Set([...prevSelected, ...visibleIds])];
      }
    });
  }, [selectedProspectIds]);

  const handleEnviarCorreosClick = () => {
    if (selectedProspectIds.length === 0) {
      Swal.fire(
        "Advertencia",
        "Por favor, selecciona al menos un prospecto para enviar un correo.",
        "warning"
      );
      return;
    }
    navigate("/enviar-correo-empresa", { state: { selectedProspectIds } });
  };

  return (
    <LayoutAdmin title={"AdminDashboard"}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <SearchProspectControl
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <EstadoFilterControl
            filtroEstado={filtroEstado}
            onFiltroEstadoChange={setFiltroEstado}
            estadoOptions={estadoOptions}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnviarCorreosClick}
            disabled={selectedProspectIds.length === 0}
            sx={{ flexShrink: 0 }}
          >
            Enviar Correo a ({selectedProspectIds.length}) Prospecto(s)
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <ProspectsTable
            data={filteredData}
            onEstadoChange={handleEstadoChange}
            estadoOptions={estadoOptions}
            selectedProspects={selectedProspectIds}
            onSelectProspect={handleSelectProspect}
            onSelectAllProspects={handleSelectAllProspects}
          />
        )}
      </Box>
    </LayoutAdmin>
  );
};

export default AdminDashboard;