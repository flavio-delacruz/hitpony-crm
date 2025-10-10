// src/pages/.../components/CrmColumn.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import { PALETA } from "../../../../theme/paleta";

import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/400.css";

const RADIUS = 24;        // ovalado consistente
const TITLE_SHIFT = 24;   // ← mueve el título a la derecha (px)

// Etiquetas por ID
const LABELS = {
  leads: "Leads",
  nutricion: "Nutrición",
  interesado: "Interesado",
  agendado: "Agendado",
  ganado: "Ganado",
  seguimiento: "Seguimiento",
  perdido: "Perdido",
};

const CrmColumn = ({ columnId, items = [], onWheel }) => {
  const title = LABELS[columnId] || columnId;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Título desplazado a la derecha */}
      <Typography
        variant="subtitle1"
        sx={{
          pl: `${TITLE_SHIFT}px`,   // ← aquí movemos el texto
          pr: 2,
          pt: 1,
          pb: 1,
          fontWeight: 600,
          color: PALETA.text,
        }}
      >
        {title}
      </Typography>

      {/* Contenedor interno OVALADO (scroll/droppable) */}
      <Box
        id={columnId}
        onWheel={(e) => onWheel?.(e, columnId)}
        sx={{
          position: "relative",
          flex: 1,
          borderRadius: RADIUS,
          background: PALETA.white,
          border: `1px solid ${PALETA.border}`,
          boxShadow: PALETA.shadowSoft,
          overflowY: "auto",
          overflowX: "hidden",
          p: 1.25,
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(11,141,181,.35)",
            borderRadius: 999,
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: "100%",
                borderRadius: RADIUS - 6,
                p: 0.5,
                display: "grid",
                gap: 1,
                outline: snapshot.isDraggingOver
                  ? `2px dashed ${PALETA.cyan}`
                  : "none",
                outlineOffset: -4,
                transition: "outline-color .2s ease",
              }}
            >
              {items.map((item, index) => (
                <Box
                  key={item.id || `${columnId}-${index}`}
                  sx={{
                    borderRadius: 16,
                    border: `1px solid ${PALETA.border}`,
                    background: "#FAFCFF",
                    p: 1.25,
                    color: PALETA.text,
                    boxShadow: "0 2px 10px rgba(33,30,38,.05)",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {item.nombre || item.name || "Prospecto"}
                  </Typography>
                  {item.email && (
                    <Typography sx={{ fontSize: 12, opacity: 0.75 }}>
                      {item.email}
                    </Typography>
                  )}
                </Box>
              ))}

              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </Box>
  );
};

export default CrmColumn;
