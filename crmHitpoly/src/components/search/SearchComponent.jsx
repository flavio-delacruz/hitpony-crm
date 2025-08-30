import { useState, useEffect, useRef } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProspectos } from "../../context/ProspectosContext"; // ⭐ Importamos el hook del contexto

function Search() {
  // ⭐ Ahora obtenemos los prospectos directamente del contexto
  const { prospectos, loadingProspectos } = useProspectos();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef(null);

  // ⭐ Eliminamos el useEffect que hacía la llamada a la API, ya no es necesario.
  // La lista de prospectos ahora se gestiona globalmente en el contexto.
  // Puedes usar el estado `loadingProspectos` si necesitas mostrar un indicador de carga.

  const resultadosFiltrados = searchTerm
    ? prospectos.filter((prospecto) =>
        Object.values(prospecto).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  const handleSelectProspecto = (prospecto) => {
    // 💡 Usa la lógica de navegación para pasar el nombre y apellido si los necesitas
    // Esto es una mejora sobre la simple navegación por ID
    if (prospecto && prospecto.id) {
        const slug = `${prospecto.nombre?.toLowerCase().replace(/\s+/g, '-')}-${prospecto.apellido?.toLowerCase().replace(/\s+/g, '-')}`;
        navigate(`/pagina-de-contacto/${slug}-${prospecto.id}`);
    } else {
        console.error("No se pudo obtener el ID del prospecto.");
    }
  };

  return (
    <Box sx={{ position: "relative", width: 250 }} ref={containerRef}>
      <TextField
        fullWidth
        placeholder="Buscar contacto..."
        variant="outlined"
        size="small"
        autoComplete="off"
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setTimeout(() => setInputFocused(false), 150)}
        InputProps={{
          sx: {
            borderRadius: 2,
            fontSize: 14,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
          },
        }}
      />

      {searchTerm && inputFocused && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 10,
            maxHeight: 300,
            overflowY: "auto",
            mt: 1,
          }}
          elevation={4}
        >
          {loadingProspectos ? (
             <ListItem>
                <ListItemText primary={<Typography variant="body2">Cargando contactos...</Typography>} />
             </ListItem>
          ) : (
            <List>
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map((prospecto, index) => (
                  <ListItem
                    key={index}
                    divider
                    button
                    onClick={() => handleSelectProspecto(prospecto)}
                  >
                    <ListItemText
                      primary={`${prospecto.nombre} ${prospecto.apellido}`}
                      secondary={`Correo: ${prospecto.correo}`}
                      primaryTypographyProps={{
                        sx: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        No se encontraron contactos.
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Search;