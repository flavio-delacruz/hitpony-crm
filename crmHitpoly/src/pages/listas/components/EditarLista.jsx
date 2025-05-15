// EditarLista.jsx
import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const EditarLista = ({ lista, onNombreGuardado, onCancelEdit }) => {
  const { user } = useAuth();
  const [editedName, setEditedName] = useState(lista.nombre_lista);

  const handleGuardarNombre = async () => {
    if (editedName.trim()) {
      if (user?.id) {
        const updateData = {
          funcion: "actualizarLista",
          id: lista.id,
          nombre_lista: editedName,
          link: "",
          idSetter: user.id,
        };

        Swal.fire(
          "Guardando...",
          "Actualizando el nombre de la lista.",
          "info",
          { timer: 1500, showConfirmButton: false }
        );

        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/UpdateListaController.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, mensaje: ${errorText}`);
          }

          const data = await response.json();
          if (data.status === "success") {
            Swal.fire(
              "Guardado",
              "El nombre de la lista ha sido actualizado.",
              "success"
            );
            onNombreGuardado(lista.id, editedName);
          } else {
            Swal.fire(
              "Error",
              "No se pudo actualizar el nombre de la lista.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al actualizar el nombre.",
            "error"
          );
        } finally {
          onCancelEdit();
        }
      }
    } else {
      Swal.fire(
        "Error",
        "El nombre de la lista no puede estar vacío.",
        "error"
      );
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <TextField
        fullWidth
        label="Nuevo nombre"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        size="small"
      />
      <IconButton onClick={handleGuardarNombre} aria-label="guardar">
        <CheckIcon color="primary" />
      </IconButton>
      <IconButton onClick={onCancelEdit} aria-label="cancelar">
        <CloseIcon color="action" />
      </IconButton>
    </div>
  );
};

export default EditarLista;