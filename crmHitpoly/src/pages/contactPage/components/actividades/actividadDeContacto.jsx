import { useState, memo } from "react";
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material"; 
import Novedades from "./Novedades"; 
import Activities from "./Activities"; 
import NotasContainer from "./Notas/NotasContainer";
import CorreosContainer from "./Correos/CorreosContainer"; 
import { useParams } from "react-router-dom"; 

// Usa memo para optimizar el re-renderizado de los componentes
const MemorizedNovedades = memo(Novedades);
const MemorizedActivities = memo(Activities);
const MemorizedNotasContainer = memo(NotasContainer);
const MemorizedCorreosContainer = memo(CorreosContainer); 

export default function ContactActivity({ prospectId }) { 
  // 1. Inicia con el valor 1 para que la pestaña "Actividades" esté activa.
  const [value, setValue] = useState(1);
  const { prospectId: urlProspectId } = useParams();
  
  // 2. Inicia con showEmails en true para mostrar el contenedor de correos.
  const [showNotes, setShowNotes] = useState(false);
  const [showEmails, setShowEmails] = useState(true); 

  const handleChange = (event, newValue) => {
    console.log("handleChange se ejecutó. Nuevo valor de pestaña:", newValue);
    setValue(newValue);
    if (newValue !== 1) {
      console.log("Cambiando a pestaña 'Novedades'. Ocultando Notas y Correos.");
      setShowNotes(false);
      setShowEmails(false);
    }
  };

  const handleShowEmails = () => {
    console.log("Se hizo clic en la pestaña 'Correo'.");
    setShowEmails(true);
    setShowNotes(false); 
    setValue(1); 
    console.log("Estados actualizados: showEmails =", true, "showNotes =", false, "value =", 1);
  };
  
  const handleShowNotes = () => {
    console.log("Se hizo clic en la pestaña 'Crear Nota'.");
    setShowNotes(true);
    setShowEmails(false); 
    setValue(1); 
    console.log("Estados actualizados: showNotes =", true, "showEmails =", false, "value =", 1);
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, borderRadius: "5px", }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Novedades" />
          <Tab label="Actividades" />
        </Tabs>
        <Box mt={2} sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: value === 0 ? 'block' : 'none',
            }}
          >
            <MemorizedNovedades prospectId={prospectId} />
          </Box>
          <Box
            sx={{
              display: value === 1 ? 'block' : 'none',
              width: '100%',
            }}
          >
            <MemorizedActivities 
              prospectId={prospectId} 
              onEmailClick={handleShowEmails} 
              onNoteClick={handleShowNotes}
            />
            {showNotes && <MemorizedNotasContainer prospectoId={prospectId} />}
            {showEmails && <MemorizedCorreosContainer prospectoId={prospectId} />}
          </Box>
        </Box>
      </Paper>
    </>
  );
}