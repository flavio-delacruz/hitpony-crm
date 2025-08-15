// src/context/ProspectosContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

const ProspectosContext = createContext();

export const useProspectos = () => useContext(ProspectosContext);

export const ProspectosProvider = ({ children }) => {
  const { user } = useAuth();
  const [prospectos, setProspectos] = useState(() => {
    try {
      const localData = localStorage.getItem("prospectos");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });
  const [loadingProspectos, setLoadingProspectos] = useState(false);
  const [errorProspectos, setErrorProspectos] = useState(null);
  const isCheckingForChanges = useRef(false);

  const fetchAllProspects = useCallback(async () => {
    if (!user || !user.id || isCheckingForChanges.current) {
      return;
    }
    
    isCheckingForChanges.current = true;
    setLoadingProspectos(true);
    setErrorProspectos(null);

    try {
      let allProspects = [];
      const { id, id_tipo } = user;

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
          const asignacionDelCloser = asignacionesData.data.find(asignacion => Number(asignacion.id_closer) === Number(id));
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
      const userProspectsData = await userProspectsResponse.json();
      const prospectsFromUser = userProspectsData.resultado || [];
      
      const finalProspects = (user.id_tipo === "3" || user.id_tipo === 3)
        ? [...allProspects, ...prospectsFromUser]
        : prospectsFromUser;

      const nuevosProspectosFormatted = finalProspects.map((item) => ({
        id: item.id,
        ...item,
      }));
      
      setProspectos(nuevosProspectosFormatted);
      localStorage.setItem("prospectos", JSON.stringify(nuevosProspectosFormatted));

    } catch (error) {
      setErrorProspectos("Error al cargar prospectos: " + error.message);
    } finally {
      setLoadingProspectos(false);
      isCheckingForChanges.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchAllProspects();
      const intervalId = setInterval(() => fetchAllProspects(), 60000);
      return () => clearInterval(intervalId);
    }
  }, [user, fetchAllProspects]);

  const actualizarProspecto = useCallback((prospectoActualizado) => {
    setProspectos((prevProspectos) => {
      const updatedProspectos = prevProspectos.map((prospecto) =>
        prospecto.id === prospectoActualizado.id
          ? prospectoActualizado
          : prospecto
      );
      try {
        localStorage.setItem("prospectos", JSON.stringify(updatedProspectos));
      } catch (error) {}
      return updatedProspectos;
    });
  }, []);

  const value = {
    prospectos,
    loadingProspectos,
    errorProspectos,
    fetchProspectos: fetchAllProspects,
    actualizarProspecto,
  };

  return (
    <ProspectosContext.Provider value={value}>
      {children}
    </ProspectosContext.Provider>
  );
};