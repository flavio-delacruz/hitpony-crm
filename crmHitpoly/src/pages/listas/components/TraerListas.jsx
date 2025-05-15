// TraerListas.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const TraerListas = ({ setListas }) => {
  const { user } = useAuth();

  useEffect(() => {
    const fetchLists = async () => {
      if (user?.id) {
        try {
          const response = await fetch(
            "https://apiweb.hitpoly.com/ajax/traerListaController.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                funcion: "getLista",
                id: user.id,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const listasConProspectos = (data.resultado || []).map((lista) => {
            const listaConProspectos = {
              ...lista,
              prospectos: Array.isArray(lista.prospectos)
                ? lista.prospectos
                : [],
            };
            console.log(
              `${listaConProspectos.nombre_lista} (${listaConProspectos.prospectos.length})`
            );
            return listaConProspectos;
          });
          setListas(listasConProspectos);
        } catch (error) {
          setListas([]);
        }
      }
    };

    fetchLists();
  }, [user?.id, setListas]);

  return null;
};

export default TraerListas;
