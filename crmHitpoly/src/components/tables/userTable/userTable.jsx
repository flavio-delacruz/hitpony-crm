import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";

const UserTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const users = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      ultima_actividad: "Hace 2 días",
    },
    {
      id: 2,
      name: "Ana Gómez",
      email: "ana.gomez@example.com",
      ultima_actividad: "Hace 5 horas",
    },
    {
      id: 3,
      name: "Carlos Díaz",
      email: "carlos.diaz@example.com",
      ultima_actividad: "Hace 1 semana",
    },
    {
      id: 4,
      name: "Lucía Sánchez",
      email: "lucia.sanchez@example.com",
      ultima_actividad: "Hace 4 días",
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      sx={{
        margin: { xs: "10px auto", sm: "20px auto" },
        padding: { xs: "none", sm: "20px" },
        boxShadow: "none",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ultima Actividad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.ultima_actividad}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UserTable;
