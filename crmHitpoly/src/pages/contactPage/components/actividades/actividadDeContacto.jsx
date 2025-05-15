// ContactActivity.jsx
import { useState } from "react";
import { Paper, Tabs, Tab, Box } from "@mui/material";
import Novedades from "./Novedades"; 
import Activities from "./Activities"; 
import { useParams } from "react-router-dom"; 

export default function ContactActivity({ prospectId }) { 
  const [value, setValue] = useState(0);
  const { prospectId: urlProspectId } = useParams(); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: "5px", }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Novedades" /> {/* Cambia la etiqueta */}
        <Tab label="Actividades" />
      </Tabs>

      <Box mt={2}>
        {value === 0 && <Novedades prospectId={prospectId} />} {/* Pasa el ID numérico como prop */}
        {value === 1 && <Activities prospectId={prospectId} />} {/* También puedes pasarlo a Activities si lo necesita */}
      </Box>
    </Paper>
  );
}