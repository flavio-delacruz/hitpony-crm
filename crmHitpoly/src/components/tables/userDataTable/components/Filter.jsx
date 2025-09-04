// ProspectFilter.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';

const ProspectFilter = ({ setFilterModel, rows }) => {
  const [nombreFilter, setNombreFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  useEffect(() => {
    // Arma el modelo de filtro con base en los estados locales,
    // que se derivan de la prop 'rows'.
    const filterItems = [];

    if (estadoFilter) {
      filterItems.push({
        field: 'estado_contacto',
        operator: 'equals',
        value: estadoFilter,
      });
    }

    const newFilterModel = {
      items: filterItems,
      quickFilterValues: nombreFilter ? [nombreFilter] : [],
      quickFilterLogicOperator: 'or',
    };

    setFilterModel(newFilterModel);
  }, [nombreFilter, estadoFilter, setFilterModel]);

  // Saca los estados directamente desde los rows devueltos por el endpoint.
  // Esto no depende de las columnas visibles de la tabla.
  const estadoOptions = Array.from(
    new Set(rows.map(row => row.estado_contacto).filter(Boolean))
  );

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ width: { xs: "100%", md: "50%" }, mr: { xs: "0", md: 2 } }}
    >
      <TextField
        label="Filtrar por Nombre"
        value={nombreFilter}
        onChange={(e) => setNombreFilter(e.target.value)}
        size="small"
        sx={{ width: '50%' }}
      />
      <FormControl
        size="small"
        sx={{ width: '50%' }}
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
            <MenuItem key={estado} value={estado}>
              {estado}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ProspectFilter;