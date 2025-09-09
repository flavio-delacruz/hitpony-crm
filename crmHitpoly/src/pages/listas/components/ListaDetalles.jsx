import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../../components/layout/layout";
import { Typography, Button } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/tables/userDataTable/ReusableTable";

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
  const { nombreLista } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const listaSeleccionada = state?.listaSeleccionada;

  // Lógica de estado de prospectos y carga
  const [prospectos, setProspectos] = useState(() => {
    try {
      const localData = localStorage.getItem("prospectos");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });
  console.log("Datos de prospectos cargados desde localStorage:", prospectos);

  // Otros estados del componente
  const [loadingProspectos, setLoadingProspectos] = useState(false);
  const [errorProspectos, setErrorProspectos] = useState(null);
  const [selectedProspectIds, setSelectedProspectIds] = useState([]);
  const [listProspectsIds, setListProspectsIds] = useState([]);
  const [isLoadingIds, setIsLoadingIds] = useState(false);

  // Lógica para formatear el nombre de la lista
  const formattedName = nombreLista.replace(/-(\d+)$/, "").replace(/-/g, " ");
  const displayNombreLista = formattedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Lógica para obtener prospectos (copiada del hook useProspectos)
  const fetchAllProspects = useCallback(async () => {
    if (!listaSeleccionada?.id) {
      setErrorProspectos("No se encontró el ID de la lista.");
      return;
    }

    setLoadingProspectos(true);
    setErrorProspectos(null);

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosPorListaIdController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "getProspectosIds",
            id_lista: listaSeleccionada.id,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setListProspectsIds(data.data);
        console.log("IDs de la lista recibidos de la API:", data.data);
      } else {
        setListProspectsIds([]);
        console.log("La API no devolvió IDs de prospectos. Respuesta:", data);
      }
    } catch (error) {
      setListProspectsIds([]);
      setErrorProspectos("Error al obtener los prospectos de la lista.");
      console.error("Error al obtener los IDs de la lista:", error);
    } finally {
      setLoadingProspectos(false);
    }
  }, [listaSeleccionada]);

  useEffect(() => {
    fetchAllProspects();
  }, [fetchAllProspects]);

  const filteredProspectos = listProspectsIds.length > 0
    ? prospectos.filter((prospecto) => listProspectsIds.includes(Number(prospecto.id)))
    : [];

  console.log("Datos finales para la tabla (después de filtrar):", filteredProspectos);

  const handleRowSelectionChange = (newSelectionModel) => {
    setSelectedProspectIds(newSelectionModel);
  };

  const handleEnviarCorreoClick = () => {
    if (selectedProspectIds.length > 0) {
      navigate("/enviar-correo", { state: { selectedProspectIds } });
    } else {
      alert("Por favor, selecciona al menos un prospecto.");
    }
  };

  const handleDeleteProspectsClick = async () => {
    if (selectedProspectIds.length === 0) {
      alert("Por favor, selecciona al menos un prospecto para eliminar.");
      return;
    }
    if (!listaSeleccionada || !listaSeleccionada.id) {
      alert("Error: No se encontró el ID de la lista.");
      return;
    }

    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar ${selectedProspectIds.length} prospectos de esta lista?`
      )
    ) {
      const prevListProspectsIds = [...listProspectsIds];

      setListProspectsIds((currentIds) =>
        currentIds.filter((id) => !selectedProspectIds.includes(Number(id)))
      );
      setSelectedProspectIds([]);

      try {
        const deletePromises = selectedProspectIds.map((prospectId) =>
          fetch("https://apiweb.hitpoly.com/ajax/borrarSetterListaController.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accion: "BorrarSetter",
              id: prospectId,
              id_lista: listaSeleccionada.id,
            }),
          })
        );

        const results = await Promise.all(deletePromises);

        const allSucceeded = results.every((response) => response.ok);

        if (!allSucceeded) {
          setListProspectsIds(prevListProspectsIds);
          alert(
            "Hubo un error al eliminar uno o más prospectos. La lista se ha restaurado."
          );
        }
      } catch (error) {
        setListProspectsIds(prevListProspectsIds);
        alert("Hubo un error de conexión, la lista se ha restaurado.");
      }
    }
  };

  const handleRowClick = (params) => {
    const prospecto = params.row;
    if (prospecto && prospecto.id && prospecto.nombre && prospecto.apellido) {
      const slug = `${prospecto.nombre
        .toLowerCase()
        .replace(/\s+/g, "-")}-${prospecto.apellido
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigate(`/pagina-de-contacto/${slug}-${prospecto.id}`);
    } else {
      // Manejo de error o caso de prospecto no válido
    }
  };

  if (loadingProspectos) {
    return (
      <Layout title={`Detalles de la Lista: ${displayNombreLista}`}>
        <Typography>Cargando prospectos...</Typography>
      </Layout>
    );
  }

  if (errorProspectos) {
    return (
      <Layout title={`Detalles de la Lista: ${displayNombreLista}`}>
        <Typography color="error">{errorProspectos}</Typography>
      </Layout>
    );
  }

  return (
    <Layout title={`${displayNombreLista}`}>
      <div style={{ width: "100%" }}>
        <ReusableTable
          rows={filteredProspectos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          {selectedProspectIds.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnviarCorreoClick}
              >
                Enviar Correo a Seleccionados
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteProspectsClick}
              >
                Eliminar Seleccionados
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ListaDetalles;