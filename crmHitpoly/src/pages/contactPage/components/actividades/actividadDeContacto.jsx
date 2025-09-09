import { useState, memo } from "react";
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material"; 
import Novedades from "./Novedades"; 
import Activities from "./Activities"; 
import NotasContainer from "./Notas/NotasContainer";
import CorreosContainer from "./Correos/CorreosContainer"; 
import { useParams } from "react-router-dom"; 

const MemorizedNovedades = memo(Novedades);
const MemorizedActivities = memo(Activities);
const MemorizedNotasContainer = memo(NotasContainer);
const MemorizedCorreosContainer = memo(CorreosContainer); 

export default function ContactActivity({ prospectId }) { 
  // ✅ CAMBIO: Inicializa el estado con 0 para que la primera pestaña ("Novedades") esté activa por defecto.
  const [value, setValue] = useState(0); 
  const { prospectId: urlProspectId } = useParams();
  const [showNotes, setShowNotes] = useState(false);
  const [showEmails, setShowEmails] = useState(true); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 1) {
      setShowNotes(false);
      setShowEmails(false);
    }
  };

  const handleShowEmails = () => {
    setShowEmails(true);
    setShowNotes(false); 
    setValue(1); 
    };
  
  const handleShowNotes = () => {
    setShowNotes(true);
    setShowEmails(false); 
    setValue(1); 
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