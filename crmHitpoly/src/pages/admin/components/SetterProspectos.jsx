import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import useProspectos from './UsuariosDeProspectos';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  overflow: 'auto',
  maxHeight: '70vh',
  margin: theme.spacing(2, 0),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(2, 2),
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
}));

const estadoOptions = [
  { value: 'all', label: 'Todos los estados' }, // Opción para mostrar todos
  { value: 'leads', label: 'Leads' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'interesado', label: 'Interesado' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'ganado', label: 'Ganado' },
  { value: 'seguimiento', label: 'Seguimiento' },
  { value: 'perdido', label: 'Perdido' },
];

const SetterProspectos = ({ setterId, onClose }) => {
  const { fetchProspectos, updateProspectoEstado } = useProspectos();
  const [prospectos, setProspectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('all'); // Estado para el filtro por estado

  useEffect(() => {
    const loadProspectos = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchProspectos({ id: setterId });
      setProspectos(data || []);
      setLoading(false);
    };
    loadProspectos();
  }, [fetchProspectos, setterId]);

  const handleEstadoChange = async (event, prospectId) => {
    const nuevoEstado = event.target.value;
    const actualizado = await updateProspectoEstado({ prospectId, nuevoEstado });
    if (actualizado) {
      setProspectos(prev =>
        prev.map(p => p.id === prospectId ? { ...p, estado_contacto: nuevoEstado } : p)
      );
    } else {
      // Aquí se podría añadir una notificación al usuario si la actualización falla,
      // pero se ha quitado el console.error según tu solicitud.
    }
  };

  // Función para manejar el cambio del filtro de estado global
  const handleGlobalFiltroEstadoChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  // Filtrar prospectos basado únicamente en el estado seleccionado
  const prospectosFiltrados = prospectos.filter(prospecto => {
    return filtroEstado === 'all' || prospecto.estado_contacto === filtroEstado;
  });

  const prospectoColumns = [
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'apellido', headerName: 'Apellido' },
    { field: 'email', headerName: 'Email' },
    { field: 'telefono', headerName: 'Teléfono' },
    {
      field: 'estado_contacto',
      headerName: 'Estado',
      renderCell: ({ row }) => (
        <FormControl size="small" fullWidth>
          <InputLabel id={`estado-select-label-${row.id}`}>Estado</InputLabel>
          <Select
            labelId={`estado-select-label-${row.id}`}
            id={`estado-select-${row.id}`}
            // Asegúrate de que el valor exista en las opciones para evitar advertencias
            value={estadoOptions.some(opt => opt.value === row.estado_contacto) ? row.estado_contacto : ""}
            label="Estado"
            onChange={(event) => handleEstadoChange(event, row.id)}
          >
            {estadoOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
      width: 180, // Puedes ajustar el ancho si es necesario
    },
  ];

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Cargando prospectos...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">{error}</Typography>
      <Button onClick={onClose}>Volver a la lista de Setters</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={onClose} sx={{ mb: 2 }}>Volver a la lista de Setters</Button>
      <Typography variant="h6" gutterBottom>
        Prospectos del Setter ID: {setterId}
      </Typography>

      {/* Control de Filtro por Estado */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="global-estado-filter-label">Filtrar por Estado</InputLabel>
          <Select
            labelId="global-estado-filter-label"
            id="global-estado-filter"
            value={filtroEstado}
            label="Filtrar por Estado"
            onChange={handleGlobalFiltroEstadoChange}
          >
            {estadoOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {prospectosFiltrados.length > 0 ? (
        <StyledTableContainer component={Paper}>
          <StyledTable aria-label="prospectos-table">
            <StyledTableHead>
              <TableRow>
                {prospectoColumns.map(column => (
                  <StyledHeaderTableCell key={column.field}>{column.headerName}</StyledHeaderTableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {prospectosFiltrados.map(prospecto => (
                <StyledTableRow key={prospecto.id}>
                  {prospectoColumns.map(column => (
                    <StyledTableCell key={column.field}>
                      {column.renderCell ? column.renderCell({ row: prospecto }) : prospecto[column.field]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      ) : (
        <Typography>No se encontraron prospectos con el estado seleccionado.</Typography>
      )}
    </Box>
  );
};

export default SetterProspectos;