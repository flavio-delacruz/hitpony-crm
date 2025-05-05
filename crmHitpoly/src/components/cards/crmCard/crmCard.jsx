import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Avatar, Typography, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";



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
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 16,
  marginBottom: 8,
  background: isDragging ? "#c8e6c9" : "#fff",
  borderRadius: "0.5rem",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  border: "1px solid #ccc",
  cursor: "pointer",
  ...draggableStyle,
});

const CrmCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [columns, setColumns] = useState({
    leads: [],
    nutrición: [],
    interesado: [],
    agendado: [],
    ganado: [],
    seguimiento: [],
    perdido: [],
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProspectos = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ funcion: "getProspectos", id: user.id }),
          }
        );

        const data = await response.json();
        const prospectos = Array.isArray(data.resultado) ? data.resultado : [];

        const organizedColumns = {
          leads: [],
          nutrición: [],
          interesado: [],
          agendado: [],
          ganado: [],
          seguimiento: [],
          perdido: [],
        };
        
        prospectos.forEach((p) => {
          const estado = p.estado_contacto?.toLowerCase() || "leads";
          if (organizedColumns[estado]) {
            organizedColumns[estado].push(p);
          } else {
            // Si el estado no coincide, los mandamos a Leads por defecto
            organizedColumns["Leads"].push(p);
          }
        });
        
        setColumns(organizedColumns);
        

        if (prospectos.length === 0) {
        }
      } catch (error) {
      }
    };

    fetchProspectos();
  }, [user]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Si se movió dentro de la misma columna
    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(
        columns[source.droppableId],
        source.index,
        destination.index
      );
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: reordered,
      }));
      return;
    }

    // Se movió de una columna a otra
    const movedItem = columns[source.droppableId][source.index];
    const moved = move(
      columns[source.droppableId],
      columns[destination.droppableId],
      source,
      destination
    );

    setColumns((prev) => ({
      ...prev,
      ...moved,
    }));

    // 🔄 ACTUALIZA EN EL BACKEND
    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/updateProspectoController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            id: movedItem.id,
            estado_contacto: destination.droppableId,
          }),
        }
      );

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);

        if (result.status === "success") {
          
        } else {

        }
      } catch (e) {
      }
    } catch (error) {
    }
  };

  const handleWheel = (e, columnId) => {
    const columnElement = document.getElementById(columnId);
    if (columnElement) {
      columnElement.scrollTop += e.deltaY;
    }
  };

  const handleSelectProspecto = (id) => {
    if (id) {
      navigate(`/pagina-de-contacto/${id}`);
    } else {
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          gap: 16,
          height: "80vh",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 8,
          position: "relative",
        }}
      >
        {Object.entries(columns).map(([columnId, items]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                id={columnId}
                onWheel={(e) => handleWheel(e, columnId)}
                style={{
                  ...getColumnStyle(snapshot.isDraggingOver),
                  display: "flex",
                  flexDirection: "column", 
                  overflow: "hidden", 
                  height: "100%", 
                }}
              >
                {/* Título de la columna, que no se desplaza */}
                <Typography
                  variant="h6"
                  sx={{ padding: 1, fontWeight: "bold" }}
                >
                  {capitalize(columnId)}{" "}
                  {/* o el nombre que quieras para cada columna */}
                </Typography>

                {/* Zona desplazable */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onClick={() => handleSelectProspecto(item.id)}
                        >
                          <Box sx={{ textAlign: "left" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.nombre || "Sin nombre"}
                              </Typography>
                              <Avatar src={item.foto_perfil}>
                                {item.nombre?.charAt(0) || "?"}
                              </Avatar>
                            </Box>

                            <Typography variant="body2" color="textSecondary">
                              {item.descripcion || "Sin descripción"}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <PhoneIcon sx={{ mr: 1, color: "black" }} />
                              <Typography variant="body2">
                                {item.celular || "Sin teléfono"}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <EmailIcon sx={{ mr: 1, color: "black" }} />
                              <Typography variant="body2">
                                {item.email || "Sin correo"}
                              </Typography>
                            </Box>
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Box>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default CrmCard;
