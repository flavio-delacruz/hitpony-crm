import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

// Endpoints de la API
const ENDPOINT_ASIGNAR =
  "https://apiweb.hitpoly.com/ajax/relacionCloserClienteController.php";

const ClienteCardAsignacion = ({
  cliente,
  contactos,
  asignaciones,
  handleOpenCorreo,
  onAsignacionExitosa,
}) => {
  const [selectedClosers, setSelectedClosers] = useState([]);
  const [selectedSetters, setSelectedSetters] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filtra los contactos para encontrar solo los closers y setters
  const closersDisponibles = contactos.filter(
    (contacto) => contacto.id_tipo.toString() === "3"
  );
  const settersDisponibles = contactos.filter(
    (contacto) => contacto.id_tipo.toString() === "2"
  );

  // Inicializa el estado con las asignaciones existentes
  useEffect(() => {
    // Log para ver el estado de las asignaciones que llegan al componente
    console.log("Asignaciones recibidas en ClienteCardAsignacion:", asignaciones);

    // Valida que asignaciones sea un array antes de intentar buscar
    if (asignaciones && Array.isArray(asignaciones)) {
      const asignacionCliente = asignaciones.find(
        (asig) => asig.cliente_id.toString() === cliente.id.toString()
      );

      // Log para ver si se encontró una asignación para este cliente
      console.log("Asignación encontrada para el cliente", cliente.id, ":", asignacionCliente);

      if (asignacionCliente) {
        const closersIds = asignacionCliente.closers_ids
          ? asignacionCliente.closers_ids.split(",").map((id) => id.trim())
          : [];
        const settersIds = asignacionCliente.setters_ids
          ? asignacionCliente.setters_ids.split(",").map((id) => id.trim())
          : [];
        setSelectedClosers(closersIds);
        setSelectedSetters(settersIds);
      } else {
        setSelectedClosers([]);
        setSelectedSetters([]);
      }
    }
  }, [asignaciones, cliente.id]);

  const handleCloserChange = (event) => {
    setSelectedClosers(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleSetterChange = (event) => {
    setSelectedSetters(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleAsignar = async () => {
    setCargando(true);
    setError(null);
    setSuccess(null);

    const payload = {
      accion: "asignarClosers",
      cliente_id: cliente.id,
      closers_ids: selectedClosers,
      setters_ids: selectedSetters,
    };

    // Log para ver el payload que se enviará a la API
    console.log("Enviando payload a la API:", payload);

    try {
      const response = await fetch(ENDPOINT_ASIGNAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("Asignación realizada con éxito.");
        onAsignacionExitosa();
      } else {
        throw new Error(data.message || "Error al asignar. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error al asignar:", err);
      setError(err.message || "No se pudo realizar la asignación.");
    } finally {
      setCargando(false);
    }
  };

  const getContacto = (id) => {
    return contactos.find((c) => c.id.toString() === id.toString());
  };

  return (
    <Card raised>
      {/* ... (rest of the component JSX is unchanged) */}
    </Card>
  );
};

export default ClienteCardAsignacion;