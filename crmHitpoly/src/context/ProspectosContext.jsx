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

  const fetchProspectos = useCallback(
    async (isInitialLoad = false) => {
      if (!user?.id || isCheckingForChanges.current) {
        return;
      }

      if (isInitialLoad) {
        setLoadingProspectos(true);
      }
      isCheckingForChanges.current = true;
      setErrorProspectos(null);

      try {
        const response = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ funcion: "getProspectos", id: user.id }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const nuevosProspectos = data?.resultado || data || [];
        const nuevosProspectosFormatted = nuevosProspectos.map((item) => ({
          id: item.id,
          ...item,
        }));

        const localData = localStorage.getItem("prospectos");
        const localProspectos = localData ? JSON.parse(localData) : [];

        if (
          JSON.stringify(localProspectos) !==
          JSON.stringify(nuevosProspectosFormatted)
        ) {
          setProspectos(nuevosProspectosFormatted);
          try {
            localStorage.setItem(
              "prospectos",
              JSON.stringify(nuevosProspectosFormatted)
            );
          } catch (error) {}
        } else {
        }
      } catch (error) {
        setErrorProspectos("Error al cargar prospectos: " + error.message);
      } finally {
        setLoadingProspectos(false);
        isCheckingForChanges.current = false;
      }
    },
    [user?.id]
  );

  useEffect(() => {
    fetchProspectos(true);
    const intervalId = setInterval(fetchProspectos, 6000);

    return () => clearInterval(intervalId);
  }, [fetchProspectos]);

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
    fetchProspectos,
    actualizarProspecto,
  };

  return (
    <ProspectosContext.Provider value={value}>
      {children}
    </ProspectosContext.Provider>
  );
};
