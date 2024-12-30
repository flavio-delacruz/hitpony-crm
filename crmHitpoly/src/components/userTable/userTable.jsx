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
    { id: 1, name: "Juan Pérez", email: "juan.perez@example.com", age: 25 },
    { id: 2, name: "Ana López", email: "ana.lopez@example.com", age: 30 },
    { id: 3, name: "Carlos Ruiz", email: "carlos.ruiz@example.com", age: 35 },
    { id: 4, name: "María Gómez", email: "maria.gomez@example.com", age: 28 },
    { id: 5, name: "Luis Torres", email: "luis.torres@example.com", age: 22 },
    { id: 6, name: "Sofía García", email: "sofia.garcia@example.com", age: 27 },
    { id: 7, name: "Pedro Díaz", email: "pedro.diaz@example.com", age: 32 },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", margin: "20px auto", padding: "20px" }}>
      <Typography
        variant="h5"
        component="div"
        gutterBottom
      >
        Lista de Usuarios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Edad</TableCell>
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
                  <TableCell>{user.age}</TableCell>
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
