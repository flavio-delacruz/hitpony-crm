import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField // Importa TextField para el buscador
} from "@mui/material";
import { styled } from '@mui/material/styles';
import SetterProspectos from "./components/SetterProspectos";
import Layout from "../../components/layout/layout";

// Estilos personalizados
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  overflow: 'auto', // Habilitar scroll horizontal y vertical si es necesario
  maxHeight: '70vh', // Altura máxima de la tabla
  margin: theme.spacing(2, 0),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  position: 'sticky', // Mantener la cabecera visible al hacer scroll
  top: 0,
  zIndex: 1,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
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

const AdminDashboard = () => {
  const [setters, setSetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSetterId, setSelectedSetterId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el término de búsqueda

  const fetchSetters = useCallback(async () => {
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/getSettersController.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ funcion: "get" }),
        }
      );

      if (!response.ok) {
        // console.error(`HTTP error! status: ${response.status}`); // Eliminado
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data && Array.isArray(data.data)) {
        const formattedSetters = data.data.map((setter) => ({
          id: setter.id,
          nombre: setter.nombre || '', // Asegúrate de que no sea undefined
          apellido: setter.apellido || '', // Asegúrate de que no sea undefined
          correo: setter.correo || '', // Asegúrate de que no sea undefined
          telefono: setter.telefono || '', // Asegúrate de que no sea undefined
          direccion: setter.direccion || '',
          ciudad: setter.ciudad || '',
          pais: setter.pais || '',
          codigo_postal: setter.codigo_postal || '',
          sobre_mi: setter.sobre_mi || '',
          rol: setter.rol || '',
          condicion: setter.condicion || '',
          segundo_apellido: setter.segundo_apellido || '',
          correo_corporativo: setter.correo_corporativo || '',
          cargo: setter.cargo || '',
          estado_usuario: setter.estado_usuario || '',
          documento_identidad: setter.documento_identidad || '',
          sector: setter.sector || '',
          cantidad_contactos: setter.cantidad_contactos || 0,
          reuniones_agendadas: setter.reuniones_agendadas || 0,
          ventas_concretadas: setter.ventas_concretadas || 0,
          ganancias: setter.ganancias || 0,
          textos_completos: setter.textos_completos || '',
          banner: setter.banner || '',
        }));
        setSetters(formattedSetters);
        setLoading(false);
      } else {
        // console.error("Error: Los datos recibidos no tienen la estructura esperada.", data); // Eliminado
        setError("Error: Los datos recibidos no tienen la estructura esperada.");
        setLoading(false);
      }
    } catch (e) {
      // console.error("Error al obtener setters:", e); // Eliminado
      setError(e.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetters();
  }, [fetchSetters]);

  const handleRowClick = (setterId) => {
    setSelectedSetterId(setterId);
  };

  const handleCloseProspectos = () => {
    setSelectedSetterId(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar setters basado en el término de búsqueda
  const filteredSetters = setters.filter(setter => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      setter.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      setter.apellido.toLowerCase().includes(lowerCaseSearchTerm) ||
      setter.correo.toLowerCase().includes(lowerCaseSearchTerm) ||
      setter.telefono.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <Layout title={"adminDashboard"}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración de Setters
        </Typography>
        {selectedSetterId ? (
          <SetterProspectos setterId={selectedSetterId} onClose={handleCloseProspectos} />
        ) : (
          <>
            {/* Buscador de Setters */}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Buscar Setter por Nombre, Apellido, Correo o Teléfono"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>

            <StyledTableContainer component={Paper}>
              <StyledTable>
                <StyledTableHead>
                  <TableRow>
                    <StyledHeaderTableCell>ID</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Nombre</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Apellido</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Correo</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Teléfono</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Ciudad</StyledHeaderTableCell>
                    <StyledHeaderTableCell>País</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Rol</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Estado Usuario</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Cantidad Contactos</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Reuniones Agendadas</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Ventas Concretadas</StyledHeaderTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <StyledTableCell colSpan={12} align="center">
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Cargando setters...</Typography>
                      </StyledTableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <StyledTableCell colSpan={12} align="center" style={{ color: 'red' }}>
                        {error}
                      </StyledTableCell>
                    </TableRow>
                  ) : filteredSetters.length > 0 ? (
                    filteredSetters.map((setter) => (
                      <StyledTableRow key={setter.id} onClick={() => handleRowClick(setter.id)}>
                        <StyledTableCell>{setter.id}</StyledTableCell>
                        <StyledTableCell>{setter.nombre}</StyledTableCell>
                        <StyledTableCell>{setter.apellido}</StyledTableCell>
                        <StyledTableCell>{setter.correo}</StyledTableCell>
                        <StyledTableCell>{setter.telefono}</StyledTableCell>
                        <StyledTableCell>{setter.ciudad}</StyledTableCell>
                        <StyledTableCell>{setter.pais}</StyledTableCell>
                        <StyledTableCell>{setter.rol}</StyledTableCell>
                        <StyledTableCell>{setter.estado_usuario}</StyledTableCell>
                        <StyledTableCell>{setter.cantidad_contactos}</StyledTableCell>
                        <StyledTableCell>{setter.reuniones_agendadas}</StyledTableCell>
                        <StyledTableCell>{setter.ventas_concretadas}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell colSpan={12} align="center">
                        No se encontraron setters que coincidan con la búsqueda.
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default AdminDashboard;