// src/components/ProspectsTable.js
import React, { useState } from "react";
import {
  Typography,
  Box,
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
  Checkbox,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as XLSX from "xlsx";

// Estilos personalizados
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

const ProspectsTable = ({
  data,
  onEstadoChange,
  estadoOptions,
  selectedProspects,
  onSelectProspect,
  onSelectAllProspects,
}) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadExcel = () => {
    const wsData = data.map((item) => ({
      ID: item.id,
      Nombre: item.nombre,
      Apellido: item.apellido,
      Email: item.email,
      Teléfono: item.telefono,
      "Setter Asignado": `${item.setterNombre} ${item.setterApellido}`,
      Estado: item.estado_contacto,
    }));

    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prospectos");
    XLSX.writeFile(workbook, "prospectos.xlsx");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedProspects.includes(item.id));

  if (data.length === 0) {
    return (
      <Typography>
        No se encontraron prospectos que coincidan con la búsqueda o el filtro.
      </Typography>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Tooltip title="Más opciones">
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MUIMenuItem onClick={() => { handleDownloadExcel(); handleMenuClose(); }}>
            Descargar Excel
          </MUIMenuItem>
          {/* Puedes añadir más acciones aquí */}
        </Menu>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderTableCell padding="checkbox">
                <Checkbox
                  color="secondary"
                  indeterminate={
                    selectedProspects.length > 0 &&
                    selectedProspects.length < paginatedData.length
                  }
                  checked={isAllSelected}
                  onChange={() => onSelectAllProspects(paginatedData)}
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
            {paginatedData.map((item) => {
              const isItemSelected = selectedProspects.includes(item.id);
              return (
                <StyledTableRow key={item.id} selected={isItemSelected}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={() => onSelectProspect(item.id)}
                      inputProps={{
                        "aria-labelledby": `prospect-name-${item.id}`,
                      }}
                    />
                  </StyledTableCell>
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

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[50]}
      />
    </>
  );
};

export default ProspectsTable;
