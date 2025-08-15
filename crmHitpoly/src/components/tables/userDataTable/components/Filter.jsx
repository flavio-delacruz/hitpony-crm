import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ProspectFilter = ({ columns, filterModel, setFilterModel, rows }) => {
  const [nombreFilter, setNombreFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  useEffect(() => {
    const newFilterModel = { items: [] };

    if (nombreFilter) {
      newFilterModel.items.push({
        field: 'nombre',
        operator: 'contains',
        value: nombreFilter,
      });
    }

    if (estadoFilter) {
      newFilterModel.items.push({
        field: 'estado_contacto',
        operator: 'equals',
        value: estadoFilter,
      });
    }

    setFilterModel(newFilterModel);
  }, [nombreFilter, estadoFilter, setFilterModel]);

  const estadoOptions = [...new Set(rows.map(row => row.estado_contacto))];

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <TextField
        label="Filtrar por Nombre"
        value={nombreFilter}
        onChange={(e) => setNombreFilter(e.target.value)}
        size="small" 
        sx={{ minWidth: 200 }} 
      />
      <FormControl
        size="small" 
        sx={{ minWidth: 200 }} 
      >
        <InputLabel id="estado-select-label">Filtrar por Estado</InputLabel>
        <Select
          labelId="estado-select-label"
          id="estado-select"
          value={estadoFilter}
          label="Filtrar por Estado"
          onChange={(e) => setEstadoFilter(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {estadoOptions.map((estado) => (
            <MenuItem key={estado} value={estado}>{estado}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ProspectFilter;