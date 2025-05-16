// En useProspectos.js

import { useCallback } from 'react';
import { useAuth } from "../../../../context/AuthContext";

const useProspectos = () => {
  const { user } = useAuth();

  const fetchProspectos = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: user.id }),
        }
      );

      const data = await response.json();

      
      return data.resultado ? data.resultado : [];
    } catch (error) {
      console.error("Error fetching prospectos:", error);
      return null;
    }
  }, [user?.id]); // Dependencia del useCallback

  return { fetchProspectos };
};

export default useProspectos;