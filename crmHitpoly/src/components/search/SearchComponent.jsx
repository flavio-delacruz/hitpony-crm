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
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 👈 Importa useNavigate
import Swal from "sweetalert2";

function Search() {
  const { user } = useAuth();
  const navigate = useNavigate(); // 👈 Hook de navegación
  const [prospectos, setProspectos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              funcion: "getProspectos",
              id: user?.id || 0,
            }),
          }
        );

        const data = await response.json();

        if (data.success && Array.isArray(data.resultado)) {
          setProspectos(data.resultado);
        } else {
          throw new Error("Formato de datos incorrecto");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudo obtener la lista de prospectos.",
        });
      }
    };

    if (user?.id) {
      fetchProspects();
    }
  }, [user]);

  const resultadosFiltrados = searchTerm
    ? prospectos.filter((prospecto) =>
        Object.values(prospecto).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  // 👇 Navegación al hacer clic en un contacto
  const handleSelectProspecto = (id) => {
    if (id) {
      navigate(`/pagina-de-contacto/${id}`);
    } else {
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
          <List>
            {resultadosFiltrados.length > 0 ? (
              resultadosFiltrados.map((prospecto, index) => (
                <ListItem
                  key={index}
                  divider
                  button // 👈 Hace el item clickable
                  onClick={() => handleSelectProspecto(prospecto.id)} // 👈 Navega al contacto
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
        </Paper>
      )}
    </Box>
  );
}

export default Search;
