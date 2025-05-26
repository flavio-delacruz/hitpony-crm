// src/components/ProspectsTable.js
import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox, // ¡Importa Checkbox!
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Estilos personalizados (se redefinen o importan si son compartidos)
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  overflow: "auto",
  maxHeight: "70vh",
  margin: theme.spacing(2, 0),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  position: "sticky",
  top: 0,
  zIndex: 99,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: "bold",
  padding: theme.spacing(2, 2),
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
}));

// Agrega 'selectedProspects', 'onSelectProspect' y 'onSelectAllProspects' a las props
const ProspectsTable = ({
  data,
  onEstadoChange,
  estadoOptions,
  selectedProspects,     // Nuevo: IDs de prospectos seleccionados
  onSelectProspect,      // Nuevo: Función para seleccionar un prospecto individual
  onSelectAllProspects,  // Nuevo: Función para seleccionar/deseleccionar todos
}) => {
  if (data.length === 0) {
    return (
      <Typography>
        No se encontraron prospectos que coincidan con la búsqueda o el filtro.
      </Typography>
    );
  }

  // Determinar si todos los prospectos visibles están seleccionados
  const isAllSelected = data.length > 0 && data.every(item => selectedProspects.includes(item.id));

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            {/* Nueva celda para el checkbox de selección de todos */}
            <StyledHeaderTableCell padding="checkbox">
              <Checkbox
                color="secondary" // Puedes ajustar el color según tu tema
                indeterminate={selectedProspects.length > 0 && selectedProspects.length < data.length}
                checked={isAllSelected}
                onChange={onSelectAllProspects}
                inputProps={{ 'aria-label': 'seleccionar todos los prospectos' }}
              />
            </StyledHeaderTableCell>
            <StyledHeaderTableCell>Nombre Completo Prospecto</StyledHeaderTableCell>
            <StyledHeaderTableCell>Email Prospecto</StyledHeaderTableCell>
            <StyledHeaderTableCell>Teléfono Prospecto</StyledHeaderTableCell>
            <StyledHeaderTableCell>Setter Asignado</StyledHeaderTableCell>
            <StyledHeaderTableCell>Estado del Prospecto</StyledHeaderTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((item) => {
            const isItemSelected = selectedProspects.includes(item.id);

            return (
              <StyledTableRow
                key={item.id}
                selected={isItemSelected} // Marca la fila como seleccionada visualmente
                // Puedes añadir un onClick aquí si quieres que al hacer clic en la fila también se seleccione
                // onClick={() => onSelectProspect(item.id)}
              >
                {/* Celda para el checkbox de selección individual */}
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    onChange={() => onSelectProspect(item.id)}
                    inputProps={{ 'aria-labelledby': `prospect-name-${item.id}` }}
                  />
                </StyledTableCell>
                {/* Celda que muestra Nombre y Apellido juntos */}
                <StyledTableCell id={`prospect-name-${item.id}`}>
                  {item.nombre} {item.apellido}
                </StyledTableCell>
                <StyledTableCell>{item.email}</StyledTableCell>
                <StyledTableCell>{item.telefono}</StyledTableCell>
                <StyledTableCell>
                  {item.setterNombre} {item.setterApellido}
                </StyledTableCell>
                <StyledTableCell>
                  <FormControl size="small" fullWidth>
                    <InputLabel id={`estado-select-label-${item.id}`}>
                      Estado
                    </InputLabel>
                    <Select
                      labelId={`estado-select-label-${item.id}`}
                      id={`estado-select-${item.id}`}
                      value={
                        estadoOptions.some(
                          (opt) => opt.value === item.estado_contacto
                        )
                          ? item.estado_contacto
                          : ""
                      }
                      label="Estado"
                      onChange={(event) => onEstadoChange(event, item.id)}
                    >
                      {estadoOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default ProspectsTable;