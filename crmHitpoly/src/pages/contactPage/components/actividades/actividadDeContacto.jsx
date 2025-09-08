import { useState, memo } from "react";
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material"; 
import Novedades from "./Novedades"; 
import Activities from "./Activities"; 
import CorreoFlotante from "../../../../components/correos/enviados/CorreoFlotante"; 
import NotasContainer from "./Notas/NotasContainer";
import { useParams } from "react-router-dom"; 

// Usa memo para optimizar el re-renderizado de los componentes
const MemorizedNovedades = memo(Novedades);
const MemorizedActivities = memo(Activities);
const MemorizedNotasContainer = memo(NotasContainer);

export default function ContactActivity({ prospectId }) { 
  const [value, setValue] = useState(0);
  const { prospectId: urlProspectId } = useParams();
  
  const [openEmail, setOpenEmail] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Ocultar las notas si se cambia de pestaña
    if (newValue !== 1) {
      setShowNotes(false);
    }
  };

  const handleOpenEmail = () => {
    setOpenEmail(true);
  };
  
  const handleCloseEmail = () => {
    setOpenEmail(false);
  };
  
  const handleShowNotes = () => {
    setShowNotes(true);
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
            {/* Contenedor para Novedades */}
          <Box
                sx={{
                    display: value === 0 ? 'block' : 'none',
                    

                }}
            >
                <MemorizedNovedades prospectId={prospectId} />
            </Box>

            {/* Contenedor para Actividades y Notas */}
            <Box
                sx={{
                    display: value === 1 ? 'block' : 'none',
                    width: '100%',
                }}
            >
              <MemorizedActivities 
                prospectId={prospectId} 
                onEmailClick={handleOpenEmail} 
                onNoteClick={handleShowNotes}
              />
              {showNotes && <MemorizedNotasContainer prospectoId={prospectId} />}
            </Box>
        </Box>
        
        <CorreoFlotante
          open={openEmail}
          onClose={handleCloseEmail}
          prospectoId={prospectId}
        />
      </Paper>
    </>
  );
}