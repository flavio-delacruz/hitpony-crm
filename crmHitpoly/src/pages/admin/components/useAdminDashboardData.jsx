// src/hooks/useAdminDashboardData.jsx
import { useState, useEffect, useCallback } from "react";
import useProspectos from "./UsuariosDeProspectos";

const CACHE_KEY = "adminDashboardProspectsData";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const POLLING_INTERVAL_MS = 60 * 500; // 30 seconds

const useAdminDashboardData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchProspectos, updateProspectoEstado } = useProspectos();

  const fetchData = useCallback(async () => {
    setError(null);
    let dataFromLocalStorage = null;
    let localStorageTimestamp = null;
    let cacheWasUsedForInstantDisplay = false;

    try {
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (cachedItem) {
        const { data: storedData, timestamp: storedTimestamp } = JSON.parse(cachedItem);
        dataFromLocalStorage = storedData;
        localStorageTimestamp = storedTimestamp;

        setData(storedData);
        setLoading(false);
        cacheWasUsedForInstantDisplay = true;
      }
    } catch (e) {
      console.error("Error parsing or reading localStorage data:", e);
      setError("Error al parsear o leer datos de localStorage. Se intentará cargar desde la API.");
      localStorage.removeItem(CACHE_KEY);
    }

    if (!cacheWasUsedForInstantDisplay) {
      setLoading(true);
    }

    const now = new Date().getTime();
    const shouldFetchFromApi = !dataFromLocalStorage || (now - localStorageTimestamp >= CACHE_DURATION_MS);

    if (shouldFetchFromApi) {
      try {
        const settersResponse = await fetch(
          "https://apiweb.hitpoly.com/ajax/getSettersController.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ funcion: "get" }),
          }
        );

        if (!settersResponse.ok) {
          throw new Error(`HTTP error! status: ${settersResponse.status}`);
        }
        const settersData = await settersResponse.json();

        if (!settersData?.data || !Array.isArray(settersData.data)) {
          throw new Error("Error: Los datos de setters no tienen la estructura esperada.");
        }

        const formattedSetters = settersData.data.map((setter) => ({
          id: setter.id,
          nombreSetter: setter.nombre || "",
          apellidoSetter: setter.apellido || "",
          correoSetter: setter.correo || "",
          telefonoSetter: setter.telefono || "",
        }));

        const prospectosPromises = formattedSetters.map((setter) =>
          fetchProspectos({ id: setter.id }).then((prospectos) => ({
            setterId: setter.id,
            setterNombre: setter.nombreSetter,
            setterApellido: setter.apellidoSetter,
            prospectos: prospectos || [],
          }))
        );

        const allProspectosBySetter = await Promise.all(prospectosPromises);

        const combinedData = [];
        allProspectosBySetter.forEach((setterProspects) => {
          setterProspects.prospectos.forEach((prospecto) => {
            combinedData.push({
              ...prospecto,
              id: prospecto.id,
              setterId: setterProspects.setterId,
              setterNombre: setterProspects.setterNombre,
              setterApellido: setterProspects.setterApellido,
              email: prospecto.correo || "", // Asegurarse de tener el email aquí
              telefono: prospecto.celular || "",
              nombre: prospecto.nombre || "",
              apellido: prospecto.apellido || "",
              estado_contacto: prospecto.estado_contacto || "",
            });
          });
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: combinedData,
          timestamp: new Date().getTime(),
        }));

        setData(combinedData);
        setLoading(false);

      } catch (e) {
        console.error("Error fetching data from API:", e);
        if (cacheWasUsedForInstantDisplay) {
          setError(`Error al obtener nuevos datos: ${e.message}. Se mantienen datos cacheados.`);
        } else {
          setError(e.message);
        }
        setLoading(false);
      }
    }
  }, [fetchProspectos]);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const updateProspectoEstadoInCache = useCallback(async ({ prospectId, nuevoEstado }) => {
    const actualizado = await updateProspectoEstado({ prospectId, nuevoEstado });
    if (actualizado) {
      setData((prev) => {
        const updatedData = prev.map((p) =>
          p.id === prospectId ? { ...p, estado_contacto: nuevoEstado } : p
        );
        try {
            const cachedItem = localStorage.getItem(CACHE_KEY);
            if (cachedItem) {
              const { data: storedData, timestamp: storedTimestamp } = JSON.parse(cachedItem);
              const updatedCachedData = storedData.map((p) =>
                  p.id === prospectId ? { ...p, estado_contacto: nuevoEstado } : p
              );
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                  data: updatedCachedData,
                  timestamp: storedTimestamp
              }));
            }
        } catch (e) {
            console.error("Error updating localStorage cache:", e);
        }
        return updatedData;
      });
    }
    return actualizado;
  }, [updateProspectoEstado]);

  // Esta es la función CLAVE: busca prospectos por ID dentro de los datos YA CARGADOS
  const getProspectsDataFromLoadedData = useCallback((prospectIdsToFind) => {
    if (!Array.isArray(prospectIdsToFind) || prospectIdsToFind.length === 0 || data.length === 0) {
      return [];
    }
    // Filtra los prospectos de la 'data' principal que tienen IDs que coinciden con los seleccionados
    return data.filter(p => prospectIdsToFind.includes(p.id));
  }, [data]); // Depende de 'data' para re-evaluarse si los datos cambian

  return {
    data,
    loading,
    error,
    updateProspectoEstado: updateProspectoEstadoInCache,
    fetchData,
    getProspectsDataFromLoadedData // ¡Asegúrate de exportar esta función!
  };
};

export default useAdminDashboardData;