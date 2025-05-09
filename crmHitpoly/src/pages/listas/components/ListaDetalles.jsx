import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../context/AuthContext";
import Layout from "../../../components/layout/layout";
import Swal from "sweetalert2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const columns = [
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "apellido", headerName: "Apellido", width: 150 },
  { field: "celular", headerName: "Celular", width: 130 },
  { field: "correo", headerName: "Correo", width: 250 },
  { field: "estado_contacto", headerName: "Estado", width: 150 },
  { field: "ciudad", headerName: "Ciudad", width: 150 },
  { field: "sector", headerName: "Sector", width: 150 },
  { field: "productos_interes", headerName: "Intereses", width: 200 },
];

function ListaDetalles() {
  const { nombreLista: listaSlug } = useParams();
  const navigate = useNavigate();
  const [lista, setLista] = useState(null);
  const [usuariosEnLista, setUsuariosEnLista] = useState([]);
  const { user } = useAuth();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLists, setUserLists] = useState({});
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const storedLists = localStorage.getItem(`userLists_${user?.id}`);
    if (storedLists) {
      setUserLists(JSON.parse(storedLists));
    }
    setLoadingInitial(false);
  }, [user?.id]);

  useEffect(() => {
    if (!loadingInitial) {
      const currentLista = userLists[listaSlug];
      if (listaSlug && userLists && currentLista) {
        setLista(currentLista);
        setError(null);
        setLoading(false);
      } else if (listaSlug && userLists) {
        setLista(null);
        setError("");
        setLoading(false);
      } else if (listaSlug) {
        setLoading(true);
        setError(null);
      } else {
        setLoading(false);
        setError(null);
      }
    }
  }, [listaSlug, userLists, loadingInitial]);

  useEffect(() => {
    const fetchProspectsInList = async () => {
      if (lista?.prospectIds && lista.prospectIds.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                funcion: "getProspectos",
                ids: lista.prospectIds,
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
              correo: item.correo,
              estado_contacto: item.estado_contacto,
              ciudad: item.ciudad,
              sector: item.sector,
              productos_interes: item.productos_interes,
            }));
            setUsuariosEnLista(formattedData);
          } else {
            setError("No se pudieron cargar los prospectos de la lista.");
          }
        } catch (err) {
          setError("Error al comunicarse con el servidor.");
        } finally {
          setLoading(false);
        }
      } else {
        setUsuariosEnLista([]);
        setLoading(false);
      }
    };

    fetchProspectsInList();
  }, [lista?.prospectIds, user?.id]);

  const handleRowSelectionChange = (newSelectionModel) => {
    setSelectedRowIds(newSelectionModel);
  };

  const handleDeleteSelected = async () => {
    if (selectedRowIds.length === 0) {
      Swal.fire(
        "Advertencia",
        "Por favor, selecciona al menos un prospecto para eliminar.",
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar prospectos?",
      text: "Estás seguro de que quieres eliminar los prospectos seleccionados de esta lista?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      const updatedUsuariosEnLista = usuariosEnLista.filter(
        (usuario) => !selectedRowIds.includes(usuario.id)
      );
      setUsuariosEnLista(updatedUsuariosEnLista);

      const updatedLists = { ...userLists };
      if (updatedLists[listaSlug]) {
        const updatedProspectIds = updatedLists[listaSlug].prospectIds.filter(
          (id) => !selectedRowIds.map(String).includes(id)
        );
        updatedLists[listaSlug].prospectIds = updatedProspectIds;
        localStorage.setItem(
          `userLists_${user?.id}`,
          JSON.stringify(updatedLists)
        );
        setUserLists(updatedLists);
        Swal.fire(
          "Eliminado",
          "Los prospectos han sido eliminados de la lista.",
          "success"
        );
        setSelectedRowIds([]);
      }
    }
  };

  const handleCellClick = (params, event) => {
    if (params.field === "__check__") return;
    const tag = event.target.tagName.toLowerCase();
    if (tag === "input" || tag === "label") return;
    const id = params.row.id;
    if (id) navigate(`/pagina-de-contacto/${id}`);
  };

  const handleSendMessage = () => {
    if (selectedRowIds.length === 0) {
      Swal.fire(
        "Advertencia",
        "Por favor, selecciona al menos un prospecto para enviar un correo.",
        "warning"
      );
      return;
    }
    navigate("/enviar-correo", { state: { selectedProspectIds: selectedRowIds } });
  };

  if (loading || loadingInitial) {
    return (
      <Layout title={"Detalles de la Lista"}>
        <Typography>Cargando detalles de la lista...</Typography>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Detalles de la Lista"}>
        <Typography color="error">{error}</Typography>
      </Layout>
    );
  }

  return (
    <Layout title={lista?.name || "Detalles de la Lista"}>
      {selectedRowIds.length > 0 && (
        <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="info"
            onClick={handleSendMessage}
          >
            Enviar Correo
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            Borrar Seleccionados
          </Button>
        </Stack>
      )}
      <Paper
        sx={{
          mt: 2,
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 650, width: "100%", marginTop: 0 }}>
          <DataGrid
            rows={usuariosEnLista}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleRowSelectionChange}
            rowSelectionModel={selectedRowIds}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
            localeText={{
              toolbarDensity: "Densidad",
              toolbarDensityCompact: "Compacto",
              toolbarDensityStandard: "Estándar",
              toolbarDensityComfortable: "Cómodo",
              toolbarColumns: "Columnas",
              toolbarFilters: "Filtros",
              toolbarQuickFilter: "Búsqueda rápida",
              toolbarExport: "Exportar",
            }}
            onCellClick={handleCellClick}
            sx={{
              "& .MuiDataGrid-cell": {
                cursor: "pointer",
              },
              borderRadius: "15px",
              overflow: "hidden",
            }}
          />
        </div>
      </Paper>
      <Button onClick={() => navigate("/todas-las-listas")} sx={{ mt: 2 }}>
        Volver a Mis Listas
      </Button>
    </Layout>
  );
}

export default ListaDetalles;
