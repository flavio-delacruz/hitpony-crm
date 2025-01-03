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
import UserListHeader from "../../components/headers/userListHeader/userListHeader";

const UserListPage = () => {
  const handleAddNew = () => {
    console.log("Agregar Nuevo clickeado");
  };

  const handleShareForm = () => {
    console.log("Compartir Formulario clickeado");
  };

  return (
    <Layout>
      <Box sx={{ padding: "0" }}>
        <UserListHeader
          pageName="Lista de Usuarios"
          userCount={25}
          onAddNew={handleAddNew}
          onShareForm={handleShareForm}
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

export default UserListPage;
