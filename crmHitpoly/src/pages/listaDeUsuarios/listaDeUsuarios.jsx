import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Layout from "../../components/layout/layout";
import TablaUsuarios from "../../components/tablaUsuarios/tablaUsuarios";
import NavBar from "../../components/navBar/NavBar";
import HeaderUsuarios from "../../components/headerUsuarios/headerUsuarios";

const ListaDeUsuarios = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Layout>
      <Box sx={{}}>
        {/* Toolbar */}
        <HeaderUsuarios
          pageTitle="Lista de Usuarios"
          userCount={5}
        />

        {/* Campo de búsqueda y filtro */}

        {/* Tabla */}
        <TablaUsuarios />
        {/*
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Propietario del contacto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellidos}</TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>{user.propietario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        */}
      </Box>
    </Layout>
  );
};

export default ListaDeUsuarios;
