// updateProspectoService.js

const useUpdateProspecto = () => {
  const updateProspectoEstado = async (prospectoId, nuevoEstado) => {
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/updateProspectoController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            id: prospectoId,
            estado_contacto: nuevoEstado,
          }),
        }
      );
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        return { success: result.status === "success", data: result };
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        return { success: false, error: e };
      }
    } catch (error) {
      console.error("Error updating prospecto state:", error);
      return { success: false, error };
    }
  };

  return { updateProspectoEstado };
};

export default useUpdateProspecto;