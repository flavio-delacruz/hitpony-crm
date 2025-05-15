import Button from "@mui/material/Button";
import Swal from "sweetalert2";

export const DeleteSelected = ({ selectedRows, setSelectedRows, setRows }) => {
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "Advertencia",
        "Por favor, selecciona al menos un prospecto.",
        "warning"
      );
      return;
    }

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
            body: JSON.stringify({ funcion: "delete", id }),
          })
        )
      );

      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.includes(row.id))
      );
      setSelectedRows([]);
      Swal.fire("Eliminado", "Los prospectos han sido eliminados.", "success");
    } catch (error) {
      console.error("Error eliminando:", error);
      Swal.fire("Error", "No se pudieron eliminar los prospectos.", "error");
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleDelete}
      sx={{ width: "fit-content", mt: 1 }}
    >
      Eliminar seleccionados
    </Button>
  );
};