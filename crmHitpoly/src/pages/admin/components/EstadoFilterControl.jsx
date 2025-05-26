// src/components/EstadoFilterControl.jsx
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const EstadoFilterControl = ({ filtroEstado, onFiltroEstadoChange, estadoOptions }) => {
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="global-estado-filter-label">Filtrar por Estado</InputLabel>
      <Select
        labelId="global-estado-filter-label"
        id="global-estado-filter"
        value={filtroEstado}
        label="Filtrar por Estado"
        onChange={(e) => onFiltroEstadoChange(e.target.value)}
      >
        {estadoOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EstadoFilterControl;