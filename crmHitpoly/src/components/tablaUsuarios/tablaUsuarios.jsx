import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BotonUsuarios from "../buttons/botonUsuarios/botonUsuarios";

const data = [
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    email: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
    estadoDelLead: "Activo",
    fechaDeCreacion: "2023-05-05",
    ultimaActividad: "Compra",
  },
  // Repite los datos para simular múltiples filas
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  // Repite los datos para simular múltiples filas
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  // Repite los datos para simular múltiples filas
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  {
    nombre: "Elmer",
    apellidos: "Coro Huaman",
    telefono: "784 678 893",
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
  },
  // Agrega más datos si lo deseas
];

const ContactTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        overflow: "auto",
        maxHeight: "100%",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "hsl(210, 79%, 46%)",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Nombre
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Apellidos
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Teléfono
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Correo Electrónico
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Propietario del Contacto
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Estado del lead
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Fecha de creacion
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Ultima actividad
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "hsl(210, 79%, 46%)",
                color: "#fff",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.nombre}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.apellidos}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.telefono}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.email}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.propietario}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.estadoDelLead}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.fechaDeCreacion}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {row.ultimaActividad}
              </TableCell>
              <TableCell
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <BotonUsuarios
                  text="Editar"
                  icon={EditIcon}
                  backgroundColor={"#357A38"}
                />
                <BotonUsuarios
                  text="Eliminar"
                  icon={DeleteIcon}
                  backgroundColor={"#BA000D"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactTable;
