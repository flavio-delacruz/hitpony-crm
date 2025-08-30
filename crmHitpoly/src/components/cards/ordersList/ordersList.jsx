import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UpdateIcon from "@mui/icons-material/Update";
import { useAuth } from "../../../context/AuthContext";

const OrdersList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const dataAnteriorRef = useRef([]);

  useEffect(() => {
    // Lectura de localStorage
    const savedOrdersData = localStorage.getItem("orders");
    if (savedOrdersData) {
      const parsedOrdersData = JSON.parse(savedOrdersData);
      // Solo carga las órdenes si pertenecen al usuario actual
      if (parsedOrdersData.userId === user?.id) {
        setOrders(parsedOrdersData.list);
        console.log("Órdenes cargadas de localStorage para el usuario actual:", parsedOrdersData.list);
      } else {
        console.log("Ignorando órdenes de localStorage, no coinciden con el usuario actual.");
        setOrders([]);
      }
    }

    const savedDataAnterior = localStorage.getItem("dataAnterior");
    if (savedDataAnterior) {
      dataAnteriorRef.current = JSON.parse(savedDataAnterior);
    }
  }, [user]);

  useEffect(() => {
    // Lógica para guardar las órdenes en localStorage
    if (orders.length > 0 && user) {
      const ordersToSave = {
        userId: user.id,
        list: orders
      };
      localStorage.setItem("orders", JSON.stringify(ordersToSave));
      console.log("Órdenes guardadas en localStorage:", ordersToSave);
    }
  }, [orders, user]);

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

        console.log("Respuesta completa de la API:", response.data);

        const nuevosDatos = Array.isArray(response.data.resultado)
          ? response.data.resultado
          : [];

        console.log("Comparando...");
        console.log("Datos anteriores (dataAnteriorRef):", dataAnteriorRef.current);
        console.log("Nuevos datos de la API:", nuevosDatos);

        const nuevosEventos = [];

        if (dataAnteriorRef.current.length > 0) {
          nuevosDatos.forEach((nuevo) => {
            const anterior = dataAnteriorRef.current.find(
              (item) => item.id === nuevo.id
            );

            if (anterior && JSON.stringify(anterior) !== JSON.stringify(nuevo)) {
              const diferencias = [];

              for (const key in nuevo) {
                if (
                  nuevo.hasOwnProperty(key) &&
                  anterior.hasOwnProperty(key) &&
                  nuevo[key] !== anterior[key] &&
                  key !== "updated_at" &&
                  key !== "usuario_master_id" // Ignorar este campo en la comparación de diferencias
                ) {
                  diferencias.push(
                    `${anterior[key] ?? "vacío"} → ${nuevo[key] ?? "vacío"}`
                  );
                }
              }

              if (diferencias.length > 0) {
                const detallesFormateados = diferencias.join("\n");
                nuevosEventos.push({
                  id: nuevo.id + "-update-" + Date.now(),
                  icon: "update",
                  name: `Actualización: ${nuevo.nombre || ""} ${nuevo.apellido || ""}`,
                  detalles: detallesFormateados,
                  date: `📅 (${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })})`,
                  timestamp: new Date().toISOString(),
                  usuario_master_id: nuevo.usuario_master_id,
                });
              }
            }
          });

          const nuevosIds = nuevosDatos.map((item) => item.id);

          dataAnteriorRef.current.forEach((anterior) => {
            if (!nuevosIds.includes(anterior.id)) {
              nuevosEventos.push({
                id: anterior.id + "-delete-" + Date.now(),
                icon: "delete",
                name: `Eliminado: ${anterior.nombre || ""} ${anterior.apellido || ""}`,
                detalles: "El prospecto fue eliminado.",
                date: `📅 (${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })})`,
                timestamp: new Date().toISOString(),
                usuario_master_id: anterior.usuario_master_id,
              });
            }
          });
        }

        console.log("Nuevos eventos generados:", nuevosEventos);

        dataAnteriorRef.current = nuevosDatos;
        localStorage.setItem("dataAnterior", JSON.stringify(nuevosDatos));
        console.log("Guardando datos anteriores en localStorage:", nuevosDatos);

        if (nuevosEventos.length > 0) {
          setOrders((prev) => {
            const nuevos = [...nuevosEventos, ...prev];
            const unicos = Array.from(
              new Map(nuevos.map((item) => [item.id, item])).values()
            );
            console.log("Estado de 'orders' actualizado:", unicos.slice(0, 50));
            return unicos.slice(0, 50);
          });
        }
      } catch (error) {
        console.error("Error al obtener los prospectos:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const getIcon = (iconType) => {
    if (iconType === "update") return <UpdateIcon color="secondary" />;
    if (iconType === "delete") return <HighlightOffIcon color="error" />;
    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        height: 300,
        overflow: "hidden",
      }}
    >
      <div style={{ height: "100%", overflowY: "auto" }}>
        <List>
          {orders.map((order) => (
            <ListItem key={order.id} alignItems="flex-start">
              <ListItemIcon>
                {getIcon(order.icon)}
              </ListItemIcon>
              <ListItemText
                primary={order.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {order.detalles}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="textSecondary">
                      {order.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default OrdersList;