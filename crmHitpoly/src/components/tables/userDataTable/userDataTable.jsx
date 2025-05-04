import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const googleBlue = "#4285F4";

const columns = [
  { field: "nombre", headerName: "Nombres", width: 130 },
  { field: "apellido", headerName: "Apellidos", width: 130 },
  { field: "celular", headerName: "Celular", width: 130 },
  { field: "email", headerName: "Correo", width: 180 },
  { field: "estado_contacto", headerName: "Estado", width: 130 },
  { field: "ciudad", headerName: "Ciudad", width: 130 },
  { field: "mensaje", headerName: "Mensaje", width: 200 },
  { field: "sector", headerName: "Sector", width: 130 },
  { field: "productos_interes", headerName: "Intereses", width: 180 },
  { field: "descripcion", headerName: "Descripción", width: 200 },
];

function DataTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              funcion: "getProspectos",
              id: user?.id || 0,
            }),
          }
        );

        const data = await response.json();

        if (data.success && Array.isArray(data.resultado)) {
          const formattedData = data.resultado.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            apellido: item.apellido,
            celular: item.celular,
            email: item.correo,
            estado_contacto: item.estado_contacto,
            ciudad: item.ciudad,
            mensaje: item.mensaje,
            sector: item.sector,
            productos_interes: item.productos_interes,
            descripcion: item.descripcion,
          }));
          setRows(formattedData);
        } else {
          throw new Error("Formato de datos incorrecto");
        }
      } catch (error) {
        console.error("Error al cargar prospectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudo obtener la lista de prospectos.",
        });
      }
    };

    if (user?.id) {
      fetchProspects();
    }
  }, [user]);

  const handleCellClick = (params, event) => {
    if (params.field === "__check__") return;
    const tag = event.target.tagName.toLowerCase();
    if (tag === "input" || tag === "label") return;
    const id = params.row.id;
    if (id) navigate(`/pagina-de-contacto/${id}`);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminarán ${selectedRows.length} prospectos.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(
        selectedRows.map((id) =>
          fetch("https://apiweb.hitpoly.com/ajax/eliminarProspectoTempController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              funcion: "delete",
              id,
            }),
          })
        )
      );

      setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row.id)));
      setSelectedRows([]);
      Swal.fire("Eliminado", "Los prospectos han sido eliminados.", "success");
    } catch (error) {
      console.error("Error eliminando:", error);
      Swal.fire("Error", "No se pudieron eliminar los prospectos.", "error");
    }
  };

  return (
    <Stack spacing={2}>
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          sx={{ width: "fit-content", alignSelf: "flex-end", mt: 1 }}
        >
          Eliminar seleccionados
        </Button>
      )}
      <Paper
        sx={{
          height: "80vh",
          width: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          pageSizeOptions={[5, 10, 50, 100]}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          onCellClick={handleCellClick}
          sx={{
            fontWeight: "bold",
            "& .MuiDataGrid-cell": {
              cursor: "pointer",
              transition: "color 0.3s",
            },
            "& .MuiDataGrid-cell:hover": {
              color: googleBlue,
            },
          }}
        />
      </Paper>
    </Stack>
  );
}

export default DataTable;
