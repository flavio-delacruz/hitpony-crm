// src/components/modals/CreateList.jsx

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { useAuth } from "../../../../context/AuthContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #f0f0f0",
  boxShadow: 24,
  p: 4,
};

const CreateList = ({ open, onClose, onListCreated, prospectosSeleccionados, excludeListId }) => {
  const { user } = useAuth();
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProspectIds, setSelectedProspectIds] = useState([]);
  const [existingLists, setExistingLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [selectedExistingListId, setSelectedExistingListId] = useState("");

  useEffect(() => {
    if (prospectosSeleccionados && prospectosSeleccionados.length > 0) {
      setSelectedProspectIds(prospectosSeleccionados);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const prospectIds = urlParams.getAll('idProspecto');
      const prospectIdsNumericos = prospectIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      setSelectedProspectIds(prospectIdsNumericos);
    }
  }, [prospectosSeleccionados]);

  useEffect(() => {
    const fetchExistingLists = async () => {
      if (open && user?.id) {
        setLoadingLists(true);
        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/traerListaController.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ funcion: "getLista", id: user.id }),
            }
          );
          const data = await response.json();
          const filteredLists = data.resultado.filter(list => list.id !== excludeListId);
          setExistingLists(filteredLists || []);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error de carga",
            text: "No se pudieron cargar las listas existentes.",
          });
        } finally {
          setLoadingLists(false);
        }
      }
    };
    fetchExistingLists();
  }, [open, user?.id, excludeListId]);

  const handleCreateList = async () => {
    if (selectedExistingListId === "" && !listName.trim()) {
      Swal.fire("Advertencia", "Selecciona o ingresa un nombre para la lista.", "warning");
      return;
    }
    if (selectedProspectIds.length === 0) {
      Swal.fire("Advertencia", "Selecciona al menos un prospecto.", "warning");
      return;
    }

    setLoading(true);

    try {
      let payload;
      const endpoint = "https://apiweb.hitpoly.com/ajax/registerListaController.php";

      if (selectedExistingListId) {
        payload = {
          funcion: "agregarProspectosALista",
          idLista: selectedExistingListId,
          idProspecto: selectedProspectIds,
        };
      } else {
        payload = {
          funcion: "registrarLista",
          nombre_lista: listName,
          link: "https://example.com",
          idSetter: user?.id,
          idProspecto: selectedProspectIds,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.status === "success") {
        // ✅ Se ha eliminado la notificación de éxito aquí.
        // Ahora, la notificación final se manejará en el componente padre (ListaDetalles).
        onListCreated();
        onClose();
      } else {
        Swal.fire("Error", data.message || "No se pudo realizar la acción en la lista.", "error");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error de conexión", text: "Ocurrió un error al comunicarse con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-list-modal-title"
      aria-describedby="create-list-modal-description"
    >
      <Box sx={style}>
        <Typography id="create-list-modal-title" variant="h6" component="h2">
          Crear o Añadir a Lista
        </Typography>
        {loadingLists ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="existing-list-select-label">Añadir a lista existente</InputLabel>
              <Select
                labelId="existing-list-select-label"
                value={selectedExistingListId}
                label="Añadir a lista existente"
                onChange={(e) => {
                  setSelectedExistingListId(e.target.value);
                  setListName("");
                }}
                disabled={loading}
              >
                {existingLists.length > 0 ? (
                  existingLists.map((list) => (
                    <MenuItem key={list.id} value={list.id}>
                      {list.nombre_lista}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay listas existentes</MenuItem>
                )}
              </Select>
            </FormControl>
            
            <Typography variant="body2" sx={{ my: 2, textAlign: "center" }}>
              — O —
            </Typography>

            <TextField
              label="Nombre para una nueva lista"
              fullWidth
              value={listName}
              onChange={(e) => {
                setListName(e.target.value);
                setSelectedExistingListId("");
              }}
              margin="normal"
              disabled={loading || selectedExistingListId !== ""}
            />
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateList}
          sx={{ mt: 2, mr: 2 }}
          disabled={loading || (selectedExistingListId === "" && !listName.trim())}
        >
          {loading ? "Procesando..." : "Guardar"}
        </Button>
        <Button onClick={onClose} sx={{ mt: 2 }} disabled={loading}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateList;