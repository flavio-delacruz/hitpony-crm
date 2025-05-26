// src/pages/AdminDashboard/components/DashboardControls.jsx
import React from "react";
import { Box } from "@mui/material";
import SearchSetterControl from "./SearchSetterControl"; // Asegúrate de que la ruta sea correcta
import EstadoFilterControl from "./EstadoFilterControl"; // Asegúrate de que la ruta sea correcta

const DashboardControls = ({
  searchTerm,
  onSearchChange,
  filtroEstado,
  onFiltroEstadoChange,
  estadoOptions,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
      <SearchSetterControl searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <EstadoFilterControl
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={onFiltroEstadoChange}
        estadoOptions={estadoOptions}
      />
    </Box>
  );
};

export default DashboardControls;