import Swal from "sweetalert2";

export const fetchData = async (user, setRows) => {
  if (!user || !user.id) return;

  const { id, id_tipo } = user;

  try {
    let allProspects = [];

    if (id_tipo === "3" || id_tipo === 3) {

      const asignacionesResponse = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        }
      );

      if (!asignacionesResponse.ok) {
        throw new Error(`Error HTTP! estado: ${asignacionesResponse.status}`);
      }
      const asignacionesData = await asignacionesResponse.json();
      
      let setterIds = [];
      if (asignacionesData.data && asignacionesData.data.length > 0) {
        const asignacionDelCloser = asignacionesData.data.find(asignacion => asignacion.id_closer === id);

        if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
          try {
            const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
            if (Array.isArray(parsedSetters)) {
              setterIds = parsedSetters;
            }
          } catch (e) {
          }
        }
      }

      const promises = setterIds.map(setterId =>
        fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
        }).then(res => res.json())
      );

      const allProspectsFromSetters = await Promise.all(promises);

      allProspects = allProspectsFromSetters.flatMap(data => data.resultado || []);
    }

    const userProspectsResponse = await fetch(
      "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "getProspectos", id: id }),
      }
    );

    if (!userProspectsResponse.ok) {
      throw new Error(`Error HTTP! estado: ${userProspectsResponse.status}`);
    }
    const userProspectsData = await userProspectsResponse.json();

    const prospectsFromUser = userProspectsData.resultado || [];

    const finalProspects = (id_tipo === "3" || id_tipo === 3)
      ? [...allProspects, ...prospectsFromUser]
      : prospectsFromUser;

    if (!Array.isArray(finalProspects)) {
      throw new Error("Error al cargar prospectos: Formato de datos incorrecto");
    }

    setRows(
      finalProspects.map((item) => ({
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
    Swal.fire({
      icon: "error",
      title: "Error al cargar datos",
      text: "No se pudo obtener la lista de prospectos.",
    });
  }
};