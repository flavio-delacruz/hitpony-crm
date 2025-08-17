import { useCallback } from "react";
import { useProspectos as useProspectosContext } from "../../../../context/ProspectosContext";

const useProspectos = () => {
  const { 
    prospectos, 
    loadingProspectos, 
    errorProspectos, 
    fetchProspectos: fetchAllProspects, 
    actualizarProspecto,
    deleteProspectsFromList,
  } = useProspectosContext();

  const fetchProspectos = useCallback(async () => {
    await fetchAllProspects();
    return prospectos;
  }, [fetchAllProspects, prospectos]);

  return { 
    prospectos,
    loadingProspectos,
    errorProspectos,
    fetchProspectos,
    actualizarProspecto,
    deleteProspectsFromList,
  };
};

export default useProspectos;