import React from "react";
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey } from "@mui/material/colors";

const EliminarLista = ({ listaId, onListaEliminada, onCloseMenu }) => {
  const handleEliminarLista = async () => {
    Swal.fire({
      title: "¿Eliminar lista?",
      text: "¿Estás seguro de que quieres eliminar esta lista?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/deleteListaController.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                funcion: "BorrarLista",
                id: listaId,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          onListaEliminada(listaId);
          if (onCloseMenu) {
            onCloseMenu();
          }

          let listasGuardadas =
            JSON.parse(localStorage.getItem("listas")) || [];

          listasGuardadas = listasGuardadas.filter(
            (lista) => lista.id !== listaId
          );

          localStorage.setItem("listas", JSON.stringify(listasGuardadas));

          Swal.fire("Eliminado", "La lista ha sido eliminada.", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar la lista: " + error.message,
            "error"
          );
        }
      }
    });
  };

  return (
    <MenuItem onClick={handleEliminarLista}>
      <DeleteIcon sx={{ mr: 1, color: grey[600] }} />
      Eliminar
    </MenuItem>
  );
};

export default EliminarLista;