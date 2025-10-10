// src/pages/.../CrmCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";
import { useProspectos } from "../../../context/ProspectosContext";
import useUpdateProspecto from "./components/updateProspectoService";
import CrmColumn from "./components/CrmColumn";
import { PALETA } from "../../../theme/paleta";

// Tipografía (mismo set que el dashboard)
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

// ======= Config =======
const CRM_TITLE = "CRM"; // ← cambia aquí si quieres “Hitpoly CRM”, etc.

const COLUMN_ORDER = [
  "leads",
  "nutricion",
  "interesado",
  "agendado",
  "ganado",
  "seguimiento",
  "perdido",
];

// ======= Helpers DnD =======
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = [...source];
  const destClone = [...destination];
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};

// ======= UI: Panel de cada columna (ovalado + glow) =======
const ColumnPanel = ({ children }) => (
  <Box
    sx={{
      position: "relative",
      flex: "0 0 360px",
      height: "100%",
      borderRadius: 24,
      background: PALETA.white,
      border: `1px solid ${PALETA.border}`,
      boxShadow: PALETA.shadow,
      overflow: "hidden",
      p: 1,
    }}
  >
    {/* Glow degradado detrás */}
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: -2,
        borderRadius: 24,
        background: `linear-gradient(120deg, ${PALETA.sky}, ${PALETA.cyan} 35%, ${PALETA.purple} 80%, ${PALETA.sky})`,
        filter: "blur(8px)",
        opacity: 0.45,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
    <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</Box>
  </Box>
);

// ======= Componente =======
const CrmCard = () => {
  const { prospectos } = useProspectos();
  const { updateProspectoEstado } = useUpdateProspecto();

  const [columns, setColumns] = useState({
    leads: [],
    nutricion: [],
    interesado: [],
    agendado: [],
    ganado: [],
    seguimiento: [],
    perdido: [],
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (prospectos && prospectos.length > 0) {
      const organizedColumns = {
        leads: [],
        nutricion: [],
        interesado: [],
        agendado: [],
        ganado: [],
        seguimiento: [],
        perdido: [],
      };

      prospectos.forEach((p) => {
        const estado = (p.estado_contacto || "leads").toLowerCase().trim();
        if (organizedColumns[estado]) organizedColumns[estado].push(p);
        else organizedColumns.leads.push(p);
      });

      setColumns(organizedColumns);
    } else {
      setColumns({
        leads: [],
        nutricion: [],
        interesado: [],
        agendado: [],
        ganado: [],
        seguimiento: [],
        perdido: [],
      });
    }
  }, [prospectos]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    if (sourceDroppableId === destinationDroppableId && source.index === destination.index) {
      return;
    }

    const movedItem = columns[sourceDroppableId][source.index];

    setColumns((prev) => {
      if (sourceDroppableId === destinationDroppableId) {
        const items = reorder(prev[sourceDroppableId], source.index, destination.index);
        return { ...prev, [sourceDroppableId]: items };
      } else {
        const resultLists = move(
          prev[sourceDroppableId],
          prev[destinationDroppableId],
          source,
          destination
        );
        return {
          ...prev,
          [sourceDroppableId]: resultLists[sourceDroppableId],
          [destinationDroppableId]: resultLists[destinationDroppableId],
        };
      }
    });

    await updateProspectoEstado(movedItem.id, destinationDroppableId);
  };

  const handleWheel = (e, columnId) => {
    const columnElement = document.getElementById(columnId);
    if (columnElement) columnElement.scrollTop += e.deltaY;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* ======= TÍTULO estilo Dashboard ======= */}
      <Stack sx={{ mb: 2, position: "relative", zIndex: 1 }}>
        <Typography
          component="div"
          sx={{
            fontFamily:
              "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: ".02em",
            lineHeight: 1.05,
            fontSize: { xs: 40, sm: 56 },
          }}
        >
          {CRM_TITLE.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 240, damping: 18 }}
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 10px rgba(108,77,226,.20), 0 0 12px rgba(11,141,181,.18)",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </Typography>
      </Stack>

      {/* ======= Board ======= */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          gap: 2,
          height: "80vh",
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
          position: "relative",
          fontFamily:
            "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          "&::-webkit-scrollbar": { height: 10 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(11,141,181,.35)",
            borderRadius: 999,
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {COLUMN_ORDER.map((columnId) => (
          <ColumnPanel key={columnId}>
            <CrmColumn
              columnId={columnId}
              items={columns[columnId] || []}
              onWheel={handleWheel}
            />
          </ColumnPanel>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default CrmCard;
