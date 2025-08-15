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
    const savedOrders = localStorage.getItem("orders");
    const savedDataAnterior = localStorage.getItem("dataAnterior");

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders)); 
    }

    if (savedDataAnterior) {
      dataAnteriorRef.current = JSON.parse(savedDataAnterior); 
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders)); 
    }
  }, [orders]);

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

        const nuevosDatos = Array.isArray(response.data.resultado)
          ? response.data.resultado
          : [];

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
                  key !== "updated_at"
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
              });
            }
          });
        }

        dataAnteriorRef.current = nuevosDatos;
        localStorage.setItem("dataAnterior", JSON.stringify(nuevosDatos)); 

        if (nuevosEventos.length > 0) {
          setOrders((prev) => {
            const nuevos = [...nuevosEventos, ...prev];
            const unicos = Array.from(
              new Map(nuevos.map((item) => [item.id, item])).values()
            );
            return unicos.slice(0, 50); 
          });
        }
      } catch (error) {
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
