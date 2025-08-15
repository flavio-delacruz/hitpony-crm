// src/hooks/useProspectos.js

import { useCallback } from "react";
import { useAuth } from "../../../../context/AuthContext";

const useProspectos = () => {
  const { user } = useAuth();

  const fetchProspectos = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { id, id_tipo } = user;
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
        const asignacionesData = await asignacionesResponse.json();
        let setterIds = [];

        if (asignacionesData.data && asignacionesData.data.length > 0) {
          const asignacionDelCloser = asignacionesData.data.find(
            (asignacion) => Number(asignacion.id_closer) === Number(id)
          );
          if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
            try {
              setterIds = JSON.parse(asignacionDelCloser.setters_ids);
            } catch (e) {}
          }
        }
        const promises = setterIds.map((setterId) =>
          fetch(
            "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
            }
          ).then((res) => res.json())
        );
        const allProspectsFromSetters = await Promise.all(promises);
        allProspects = allProspectsFromSetters.flatMap(
          (data) => data.resultado || []
        );
      }
      const userProspectsResponse = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: id }),
        }
      );
      const userProspectsData = await userProspectsResponse.json();
      const prospectsFromUser = userProspectsData.resultado || [];
      const finalProspects = [...allProspects, ...prospectsFromUser];
      return finalProspects.length > 0 ? finalProspects : [];
    } catch (error) {
      return null;
    }
  }, [user?.id, user?.id_tipo]);

  return { fetchProspectos };
};

export default useProspectos;
