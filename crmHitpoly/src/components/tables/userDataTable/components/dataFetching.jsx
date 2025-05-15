import Swal from "sweetalert2";

export const fetchData = async (userId, setRows) => {
  if (!userId) return;
  try {
    const response = await fetch(
      "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "getProspectos", id: userId }),
      }
    );
    const data = await response.json();
    if (!data.success || !Array.isArray(data.resultado)) {
      throw new Error("Error al cargar prospectos: Formato de datos incorrecto");
    }
    setRows(
      data.resultado.map((item) => ({
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
      }))
    );
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error al cargar datos",
      text: "No se pudo obtener la lista de prospectos.",
    });
  }
};