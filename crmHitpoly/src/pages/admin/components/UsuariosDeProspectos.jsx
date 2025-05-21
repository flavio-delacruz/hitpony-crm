// UseProspectos.jsx
import { useCallback } from 'react';
import { useAuth } from "../../../context/AuthContext";

const UseProspectos = () => {
  const { user } = useAuth(); // Aunque 'user' no se usa en este archivo, se mantiene por si es necesario en el futuro.

  const updateProspectoEstado = useCallback(async ({ prospectId, nuevoEstado }) => {
    if (!prospectId || !nuevoEstado) {
      return false;
    }

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/updateProspectoController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            id: prospectId,
            estado_contacto: nuevoEstado,
          }),
        }
      );

      const data = await response.json();

      if (data && data.status === "success") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, []);

  const fetchProspectos = useCallback(async ({ id: setterId }) => {
    if (!setterId) return null;

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
        }
      );

      const data = await response.json();
      return data.resultado ? data.resultado : [];
    } catch (error) {
      return null;
    }
  }, []);

  return {
    fetchProspectos,
    updateProspectoEstado,
  };
};

export default UseProspectos;