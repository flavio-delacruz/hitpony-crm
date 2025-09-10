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
    // Si el campo está vacío, muestra un error y no continúa
    if (!editedName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El nombre de la lista no puede estar vacío.",
      });
      return;
    }

    if (!user?.id) {
      // Si no hay usuario, no se puede guardar
      return;
    }

    try {
      const updateData = {
        funcion: "actualizarLista",
        id: lista.id,
        nombre_lista: editedName,
        link: "",
        idSetter: user.id,
      };

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
        // Muestra solo la alerta de éxito final
        Swal.fire({
          title: "Guardado",
          text: "El nombre de la lista ha sido actualizado.",
          icon: "success",
          timer: 1500, // Cierra automáticamente después de 1.5 segundos
          showConfirmButton: false,
        });
        onNombreGuardado(lista.id, editedName);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el nombre de la lista.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el nombre.",
      });
    } finally {
      onCancelEdit();
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