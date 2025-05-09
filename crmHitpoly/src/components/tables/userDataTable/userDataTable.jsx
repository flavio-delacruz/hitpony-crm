import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../../pages/listas/components/slugify";

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

  const handleAddToLista = (listaNombre) => {
    if (selectedRows.length === 0) {
      Swal.fire("Advertencia", "Por favor, selecciona al menos un prospecto.", "warning");
      return;
    }

    const storedLists = localStorage.getItem(`userLists_${user?.id}`);
    let lists = storedLists ? JSON.parse(storedLists) : {};
    const listaSlug = slugify(listaNombre); // Genera el slug

    if (lists[listaSlug]) {
      Swal.fire("Error", `La lista "${listaNombre}" ya existe.`, "error");
      return;
    } else {
      lists[listaSlug] = { name: listaNombre, slug: listaSlug, prospectIds: selectedRows.map(id => id.toString()) }; // Guarda el slug
    }

    localStorage.setItem(`userLists_${user?.id}`, JSON.stringify(lists));
    Swal.fire("Éxito", `Se añadieron ${selectedRows.length} prospectos a la lista "${listaNombre}".`, "success").then(() => {
      navigate(`/listas/${listaSlug}`); // Navega usando el slug
    });
    setSelectedRows([]);
  };

  const handleSendMessage = () => {
    if (selectedRows.length === 0) {
      Swal.fire("Advertencia", "Por favor, selecciona al menos un prospecto para enviar un mensaje.", "warning");
      return;
    }
    // Navegar al componente de envío de correo con los IDs seleccionados
    navigate("/enviar-correo", { state: { selectedProspectIds: selectedRows } });
  };

  return (
    <Stack spacing={2}>
      {selectedRows.length > 0 && (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Swal.fire({
                title: '¿Nombre para la lista?',
                input: 'text',
                inputValue: '',
                showCancelButton: true,
                confirmButtonText: 'Crear lista',
                preConfirm: (listaName) => {
                  if (!listaName) {
                    Swal.showValidationMessage(`Por favor, ingresa un nombre para la lista.`);
                  }
                  return listaName;
                }
              }).then((result) => {
                if (result.isConfirmed && result.value) {
                  handleAddToLista(result.value);
                }
              });
            }}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Añadir a Lista
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Eliminar seleccionados
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleSendMessage}
            sx={{ width: "fit-content", mt: 1 }}
          >
            Enviar Correo
          </Button>
        </Stack>
      )}
      <Paper
        sx={{
          height: "80vh",
          width: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          overflow: "hidden",
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
            border: "none", 
          }}
        />
      </Paper>
    </Stack>
  );
}

export default DataTable;