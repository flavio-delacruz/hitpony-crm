import React, { useState, useRef } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProspectos } from "../../context/ProspectosContext";
import { PALETA } from "../../theme/paleta";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

/* =========================
   UI helpers (modo claro)
========================= */
const UI = {
  sky: PALETA.sky,           // #00C2FF
  cyan: PALETA.cyan,         // #0B8DB5
  purple: PALETA.purple,     // #6C4DE2
  text: PALETA.text,         // #211E26
  white: PALETA.white,       // #FFFFFF
  border: PALETA.border,     // rgba(11,141,181,.25)
  borderSoft: PALETA.borderSoft || "rgba(11,141,181,.18)",
};

/* =========================
   Wrapper con borde degradado animado
   (lo usamos para el dropdown)
========================= */
const GradientBorder = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    sx={{
      position: "relative",
      p: "1px",
      borderRadius: 16,
      background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 35%, ${UI.purple} 80%, ${UI.sky})`,
      backgroundSize: "220% 220%",
      animation: "edgeFlow 8s linear infinite",
      ...sx,
      // Máscara para que sólo se vea el borde
      WebkitMask:
        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    }}
  >
    {children}
    <style>{`
      @keyframes edgeFlow {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </Box>
);

/* =========================
   Componente principal
========================= */
function Search() {
  const { prospectos, loadingProspectos } = useProspectos();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef(null);

  const resultadosFiltrados =
    searchTerm.trim().length > 0
      ? prospectos.filter((prospecto) =>
          Object.values(prospecto || {}).some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        )
      : [];

  const handleSelectProspecto = (prospecto) => {
    if (prospecto && prospecto.id) {
      const slug = `${(prospecto.nombre || "")
        .toLowerCase()
        .replace(/\s+/g, "-")}-${(prospecto.apellido || "")
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigate(`/pagina-de-contacto/${slug}-${prospecto.id}`);
    } else {
      console.error("No se pudo obtener el ID del prospecto.");
    }
  };

  return (
    <Box sx={{ position: "relative", width: 280 }} ref={containerRef}>
      {/* Input pill con borde gradiente al focus */}
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
            fontFamily:
              "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
            fontWeight: 700,
            borderRadius: 999,
            background: UI.white,
            color: UI.text,
            px: 1.2,
            "& input::placeholder": {
              color: "rgba(33,30,38,.55)",
              fontWeight: 600,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: UI.borderSoft,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: UI.cyan,
            },
            "&.Mui-focused": {
              boxShadow:
                "0 0 0 2px rgba(0,194,255,.20), 0 10px 24px rgba(0,0,0,.08)",
              background:
                `linear-gradient(${UI.white}, ${UI.white}) padding-box,` +
                `linear-gradient(90deg, ${UI.sky}, ${UI.cyan} 55%, ${UI.purple}) border-box`,
              border: "1px solid transparent",
            },
          },
        }}
      />

      {/* Dropdown con borde degradado animado */}
      {searchTerm && inputFocused && (
        <GradientBorder
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "100%",
            zIndex: 15,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 16,
              overflow: "hidden",
              background: UI.white,
              backdropFilter: "blur(2px)",
              maxHeight: 320,
              boxShadow: "0 14px 34px rgba(0,0,0,.12)",
            }}
          >
            {loadingProspectos ? (
              <Box
                sx={{
                  py: 2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <CircularProgress size={18} sx={{ color: UI.cyan }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(33,30,38,.7)", fontWeight: 700 }}
                >
                  Cargando contactos...
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {resultadosFiltrados.length > 0 ? (
                  resultadosFiltrados.slice(0, 50).map((prospecto, index) => (
                    <ListItem
                      key={`${prospecto.id}-${index}`}
                      component={motion.li}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: index * 0.012 }}
                      onClick={() => handleSelectProspecto(prospecto)}
                      sx={{
                        cursor: "pointer",
                        px: 1.25,
                        py: 1,
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, rgba(0,194,255,.08), rgba(108,77,226,.08))",
                        },
                        "&:active": {
                          background:
                            "linear-gradient(90deg, rgba(0,194,255,.12), rgba(108,77,226,.12))",
                        },
                      }}
                      divider
                    >
                      <ListItemText
                        primary={`${prospecto.nombre ?? ""} ${
                          prospecto.apellido ?? ""
                        }`.trim() || "Sin nombre"}
                        secondary={
                          prospecto.correo
                            ? `Correo: ${prospecto.correo}`
                            : undefined
                        }
                        primaryTypographyProps={{
                          sx: {
                            fontFamily:
                              "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
                            fontWeight: 800,
                            color: UI.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: "rgba(33,30,38,.65)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem sx={{ px: 1.5, py: 1.25 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(33,30,38,.7)",
                            fontWeight: 700,
                            fontFamily:
                              "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
                          }}
                        >
                          No se encontraron contactos.
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </GradientBorder>
      )}
    </Box>
  );
}

export default Search;
