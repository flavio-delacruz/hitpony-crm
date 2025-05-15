// Novedades.jsx
import React, { useState, useEffect } from "react";
import { TextField, Paper } from "@mui/material";
import { useProspectos } from "../../../../context/ProspectosContext";

export default function Novedades({ prospectId }) {
  console.log("Prospect ID recibida en Novedades:", prospectId);
  const { prospectos } = useProspectos();
  const [nuevaActividad, setNuevaActividad] = useState({
    estado_anterior: "",
    estado_nuevo: "",
    registro_formulario: false,
    edicion_de_datos: false,
    ingreso_ruta_web: "",
    visitas_totales: 0,
    hecha_hora_ultima_conexion_web: "",
  });
  const [prospectoLocal, setProspectoLocal] = useState(null);

  useEffect(() => {
    if (Array.isArray(prospectos) && prospectos.length > 0) {
      const prospecto = prospectos.find((p) => p.id === parseInt(prospectId));
      setProspectoLocal(prospecto);
      if (prospecto) {
        console.log("Prospecto encontrado:", prospecto); // 👈 Agregar este log
        setNuevaActividad((prevState) => ({
          ...prevState,
          estado_anterior: prospecto.estado_contacto || "",
          estado_nuevo: prospecto.estado_contacto || "",
          registro_formulario: prospecto.origen === "formulario",
          edicion_de_datos: false,
          ingreso_ruta_web: prospecto.ingreso_ruta || "",
          visitas_totales: prospecto.visitas_totales || 0,
          hecha_hora_ultima_conexion_web: prospecto.ultima_conexion_web || "",
        }));
      }
    }
    console.log("Nueva actividad inicial:", nuevaActividad); // 👈 Agregar este log
  }, [prospectos, prospectId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevaActividad((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: "5px" }}>
      <TextField
        label="Estado Anterior"
        name="estado_anterior"
        value={nuevaActividad.estado_anterior}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Estado Nuevo"
        name="estado_nuevo"
        value={nuevaActividad.estado_nuevo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Registro Formulario"
        name="registro_formulario"
        value={nuevaActividad.registro_formulario.toString()}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Edición de Datos"
        name="edicion_de_datos"
        value={nuevaActividad.edicion_de_datos.toString()}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
    </Paper>
  );
}