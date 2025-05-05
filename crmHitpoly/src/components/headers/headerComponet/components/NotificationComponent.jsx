import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  ListItemText,
  ListItemIcon,
  Box
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useAuth } from "../../../../context/AuthContext";

const LOCAL_STORAGE_KEY = "notificacionesGuardadas";
const LOCAL_STORAGE_KEY_LEIDAS = "notificacionesLeidas"; 

const NotificationComponent = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]); 
  const dataAnteriorRef = useRef([]);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const almacenadas = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (almacenadas) {
      setNotificaciones(JSON.parse(almacenadas));
    }

    const leidas = localStorage.getItem(LOCAL_STORAGE_KEY_LEIDAS);
    if (leidas) {
      setNotificacionesLeidas(JSON.parse(leidas));
    }
  }, []);

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    if (notificaciones.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notificaciones));
    }
    // Guardar las notificaciones leídas
    if (notificacionesLeidas.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_LEIDAS,
        JSON.stringify(notificacionesLeidas)
      );
    }
  }, [notificaciones, notificacionesLeidas]);

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
            headers: { "Content-Type": "application/json" },
          }
        );
  
        const nuevosDatos = Array.isArray(response.data.resultado)
          ? response.data.resultado
          : [];
  
        if (nuevosDatos.length === 0) return;
  
        if (dataAnteriorRef.current.length > 0) {
          const cambiosDetectados = [];
  
          nuevosDatos.forEach((nuevoProspecto) => {
            // Filtrar los prospectos con origen "interno"
            if (nuevoProspecto.origen === "interno") return;
  
            const anterior = dataAnteriorRef.current.find(
              (item) => item.id === nuevoProspecto.id
            );
            const origen = nuevoProspecto.origen || "Desconocido";
            const nombre = nuevoProspecto.nombre || "Sin nombre";
            const apellido = nuevoProspecto.apellido || "Sin apellido";
            const createdAt = nuevoProspecto.created_at || new Date().toISOString();
            const estado = nuevoProspecto.estado_contacto || "No especificado";
            const fecha = new Date(createdAt);
            const hora = new Intl.DateTimeFormat("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(fecha);
  
            // Filtrar y agregar las notificaciones de tipo "Nuevo prospecto" y "Actualización"
            if (!anterior) {
              cambiosDetectados.push({
                id: nuevoProspecto.id,
                tipo: "Nuevo prospecto",
                mensaje: `Nuevo prospecto: ${nombre} ${apellido} (Origen: ${origen}) - Hora: ${hora}`,
                timestamp: new Date().toISOString(),
              });
            } else if (
              JSON.stringify(anterior) !== JSON.stringify(nuevoProspecto)
            ) {
              cambiosDetectados.push({
                id: nuevoProspecto.id,
                tipo: "Actualización",
                mensaje: `Actualización en: ${nombre} ${apellido} - Estado: ${estado} - Hora: ${hora}`,
                timestamp: new Date().toISOString(),
              });
            }
          });
  
          // Filtrar las notificaciones eliminadas
          const cambiosFiltrados = cambiosDetectados.filter(
            (cambio) => cambio.tipo !== "Eliminado"
          );
  
          if (cambiosFiltrados.length > 0) {
            // Actualizar el estado con las nuevas notificaciones
            setNotificaciones((prev) => {
              const nuevasNotificaciones = [...prev, ...cambiosFiltrados];
              return nuevasNotificaciones;
            });
          }
        }
  
        dataAnteriorRef.current = nuevosDatos;
      } catch (error) {
        console.error("Error al obtener datos de prospectos:", error);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user]);
  

  // Marcar notificaciones como leídas al abrir el menú
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    // Marcar todas las notificaciones como leídas
    const notificacionesNoLeidas = notificaciones.filter(
      (notif) => !notificacionesLeidas.includes(notif.id)
    );
    const nuevasLeidas = notificacionesNoLeidas.map((notif) => notif.id);
    setNotificacionesLeidas((prev) => [...prev, ...nuevasLeidas]);
  };

  const notificacionesOrdenadas = notificaciones.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <>
      <Box onClick={handleOpenMenu}>
        <Badge
          badgeContent={
            notificaciones.filter(
              (notif) => !notificacionesLeidas.includes(notif.id)
            ).length
          }
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 380,
            height: "85vh",
            maxHeight: "100vh",
            overflowY: "auto",
          },
        }}
      >
        {notificacionesOrdenadas.length > 0 ? (
          notificacionesOrdenadas.map((notif, index) => (
            <MenuItem key={index} onClick={handleClose}>
              <ListItemIcon>
                <NotificationsActiveIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={notif.tipo}
                secondary={notif.mensaje}
                sx={{ wordWrap: "break-word", whiteSpace: "normal" }} 
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No hay notificaciones nuevas" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationComponent;
