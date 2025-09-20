
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';

const ProspectFilter = ({ setFilterModel, rows }) => {
  const [nombreFilter, setNombreFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  useEffect(() => {
    const filterItems = [];

    // Filtro por Nombre
    if (nombreFilter) {
      filterItems.push({
        field: 'nombreCompleto', // Usa el campo que combina nombre y apellido
        operator: 'contains',
        value: nombreFilter,
      });
    }

    // Filtro por Estado
    if (estadoFilter) {
      filterItems.push({
        field: 'estado_contacto',
        operator: 'equals',
        value: estadoFilter,
      });
    }

    // Filtro por Propietario
    if (ownerFilter) {
      filterItems.push({
        field: 'nombrePropietario',
        operator: 'contains',
        value: ownerFilter,
      });
    }

    const newFilterModel = {
      items: filterItems,
      // ¡Importante! Aquí especificamos explícitamente el operador AND para los items
      logicOperator: 'and',
    };

    setFilterModel(newFilterModel);
  }, [nombreFilter, estadoFilter, ownerFilter, setFilterModel]);

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
        label="Nombres"
        value={nombreFilter}
        onChange={(e) => setNombreFilter(e.target.value)}
        size="small"
        sx={{ width: '50%' }}
      />
      <TextField
        label="Propietarios"
        value={ownerFilter}
        onChange={(e) => setOwnerFilter(e.target.value)}
        size="small"
        sx={{ width: '50%' }}
      />
      <FormControl
        size="small"
        sx={{ width: '50%' }}
      >
        <InputLabel id="estado-select-label">Estados</InputLabel>
        <Select
          labelId="estado-select-label"
          id="estado-select"
          value={estadoFilter}
          label="Estados"
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