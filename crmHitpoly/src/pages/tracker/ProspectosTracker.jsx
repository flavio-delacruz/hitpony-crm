import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ProspectosTracker = () => {
    const { user } = useAuth();
    const [cambios, setCambios] = useState([]);
    const dataAnteriorRef = useRef([]);
  
    useEffect(() => {
      if (!user) return;
  
      const fetchData = async () => {
        try {
          const response = await axios.post(
            "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
            {
              funcion: "getProspectos",
              id: user.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          console.log("Respuesta de la API:", response.data);
  
          const nuevosDatos = Array.isArray(response.data.resultado)
            ? response.data.resultado
            : [];
  
          if (nuevosDatos.length === 0) {
            console.error("No hay prospectos para procesar");
            return;
          }
  
          if (dataAnteriorRef.current.length > 0) {
            const cambiosDetectados = [];
  
            nuevosDatos.forEach((nuevoProspecto) => {
              const anterior = dataAnteriorRef.current.find(
                (item) => item.id === nuevoProspecto.id
              );
  
              const origen = nuevoProspecto.origen || "Desconocido"; // Verifica si el campo origen existe
  
              if (!anterior) {
                cambiosDetectados.push({
                  id: nuevoProspecto.id,
                  tipo: "Nuevo prospecto",
                  origen: origen,
                  datos: nuevoProspecto,
                  timestamp: new Date().toISOString(),
                });
              } else if (
                JSON.stringify(anterior) !== JSON.stringify(nuevoProspecto)
              ) {
                cambiosDetectados.push({
                  id: nuevoProspecto.id,
                  tipo: "Actualización",
                  datos: nuevoProspecto,
                  timestamp: new Date().toISOString(),
                });
              }
            });
  
            // Detectar eliminaciones
            const idsNuevos = nuevosDatos.map((item) => item.id);
            dataAnteriorRef.current.forEach((anterior) => {
              if (!idsNuevos.includes(anterior.id)) {
                cambiosDetectados.push({
                  id: anterior.id,
                  tipo: "Eliminado",
                  datos: anterior,
                  timestamp: new Date().toISOString(),
                });
              }
            });
  
            if (cambiosDetectados.length > 0) {
              setCambios((prev) => [...prev, ...cambiosDetectados]);
            }
          }
  
          dataAnteriorRef.current = nuevosDatos; // Guardamos los datos actuales como referencia
        } catch (error) {
          console.error("Error al traer prospectos:", error);
        }
      };
  
      fetchData();
      const interval = setInterval(fetchData, 10000); // Repetir cada 10 segundos
      return () => clearInterval(interval);
    }, [user]);
  
    const cambiosOrdenados = cambios.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Cambios detectados para el usuario {user?.nombre || user?.id}
        </Typography>
        <List>
          {cambiosOrdenados.length > 0 ? (
            cambiosOrdenados.map((cambio, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${cambio.tipo} - Nombre: ${
                      cambio.datos?.nombre || "Desconocido"
                    } - ID: ${cambio.id}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          display="block"
                        >
                          Detalles: {JSON.stringify(cambio.datos)}
                        </Typography>
                        {/* Solo mostrar origen si el tipo es 'Nuevo prospecto' */}
                        {cambio.tipo === "Nuevo prospecto" && (
                          <Typography
                            component="span"
                            variant="body2"
                            display="block"
                          >
                            Origen: {cambio.origen}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No se han detectado cambios aún." />
            </ListItem>
          )}
        </List>
      </Box>
    );
  };
  
  export default ProspectosTracker;
  