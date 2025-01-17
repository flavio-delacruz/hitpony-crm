import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombres", headerName: "Nombres", width: 130 },
  {
    field: "apellidos",
    headerName: "Apellidos",
    type: "number",
    width: 90,
  },
  {
    field: "telefono",
    headerName: "Telefono",
    type: "number",
    width: 90,
  },
  { field: "correo", headerName: "Correo", width: 130 },
  { field: "propietario", headerName: "Propietario", width: 130 },
  { field: "estado", headerName: "Estado del Lead", width: 130 },
  { field: "creacion", headerName: "Fecha de Creacion", width: 130 },
  { field: "ciudad", headerName: "Ciudad", width: 130 },
  { field: "actividad", headerName: "Ultima Actividad", width: 130 },
  { field: "acciones", headerName: "Acciones", width: 130 },
];

const rows = [
  {
    id: 1,
    nombres: "Snow",
    apellidos: "Jon",
    telefono: 354789456,
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
    estado: "Activo",
    creacion: "2023-05-05",
    ciudad: "Lima",
    actividad: "Compra",
  },
  {
    id: 1,
    nombres: "Snow",
    apellidos: "Jon",
    telefono: 354789456,
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
    estado: "Activo",
    creacion: "2023-05-05",
    ciudad: "Lima",
    actividad: "Compra",
  },
  {
    id: 1,
    nombres: "Snow",
    apellidos: "Jon",
    telefono: 354789456,
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
    estado: "Activo",
    creacion: "2023-05-05",
    ciudad: "Lima",
    actividad: "Compra",
  },
  {
    id: 1,
    nombres: "Snow",
    apellidos: "Jon",
    telefono: 354789456,
    correo: "corohuamanelmer@gmail.com",
    propietario: "Elmer Coro",
    estado: "Activo",
    creacion: "2023-05-05",
    ciudad: "Lima",
    actividad: "Compra",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper
      sx={{
        height: "90vh",
        width: "auto",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0, borderRadius: "15px" }}
      />
    </Paper>
  );
}
