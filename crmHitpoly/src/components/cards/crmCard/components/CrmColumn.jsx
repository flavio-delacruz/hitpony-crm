import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Typography, Box } from "@mui/material";
import CrmItem from "./CrmItem";

const getColumnStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#e3f2fd" : "#f5f5f5",
  padding: 8,
  flex: "0 0 auto",
  width: 280,
  minWidth: 280,
  maxWidth: 300,
  borderRadius: "0.5rem",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  height: "100%", // Asegura que la columna ocupe toda la altura disponible
});

const CrmColumn = ({ columnId, items, onWheel }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Droppable key={columnId} droppableId={columnId}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          id={columnId}
          onWheel={(e) => onWheel(e, columnId)}
          style={{
            ...getColumnStyle(snapshot.isDraggingOver),
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6" sx={{ padding: 1, fontWeight: "bold" }}>
            {capitalize(columnId)}
          </Typography>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {items.map((item, index) => (
              <CrmItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </Box>
      )}
    </Droppable>
  );
};

export default CrmColumn;