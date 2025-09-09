// Novedades.jsx
import React, { useState, useEffect } from "react";
import { 
    Paper, 
    Box,
    Typography,
    CircularProgress
} from "@mui/material";

const API_URL = "https://apiweb.hitpoly.com/ajax/traerActividadController.php";

// --- FUNCIÓN DE CONVERSIÓN DE FECHA Y HORA ---
const getDisplayDateTime = (serverDateString, serverTimeZone) => {
    if (!serverDateString || !serverTimeZone) {
        return "";
    }

    try {
        // Paso 1: Crear un objeto de fecha con la hora del servidor y su zona horaria
        const serverDate = new Date(serverDateString);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Paso 2: Usar Intl.DateTimeFormat para manejar la conversión de zona horaria
        const formatter = new Intl.DateTimeFormat(navigator.language, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: userTimeZone, // Muestra la fecha en la zona horaria del usuario
            timeZoneName: 'short'
        });
        
        // Paso 3: Devolver la fecha y hora formateada
        return formatter.format(serverDate);
    } catch (error) {
        console.error("Error al convertir la fecha:", error);
        return serverDateString; // Devuelve el string original si hay un error
    }
};

export default function Novedades({ prospectId }) {
    const [actividades, setActividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActividades = async () => {
            if (!prospectId) return;

            setIsLoading(true);
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        funcion: "getActividad",
                        id: prospectId,
                    }),
                });
                const data = await response.json();
                
                if (data.success && data.resultado) {
                    setActividades(data.resultado);
                } else {
                    setActividades([]);
                }
            } catch (error) {
                setActividades([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActividades();
    }, [prospectId]);

    return (
        <Paper elevation={2} sx={{ p: 2, borderRadius: "5px" }}>
            <Box sx={{ mt: 1 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : actividades.length > 0 ? (
                    actividades.map((actividad) => (
                        <Box 
                            key={actividad.id} 
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                border: '1px solid #e0e0e0', 
                                borderRadius: '4px' 
                            }}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                {actividad.tipo_actividad}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {actividad.detalle_actividad}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                display="block" 
                                color="text.disabled" 
                                sx={{ mt: 1 }}
                            >
                                Fecha: {getDisplayDateTime(actividad.fecha_hora, actividad.zona_horaria)}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No hay actividades registradas para este prospecto.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}