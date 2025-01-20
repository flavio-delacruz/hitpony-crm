import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Avatar, Typography, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const getItems = (count, prefix) =>
  Array.from({ length: count }, (_, k) => ({
    id: `${prefix}-${k}`,
    content: `Item ${k}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getColumnStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: "100%",
  minHeight: 500,
  borderRadius: "0.5rem",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 16,
  margin: "0 0 8px 0",
  background: isDragging ? "lightgreen" : "white",
  borderRadius: "0.5rem",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  border: "1px solid grey",
  ...draggableStyle,
});

const CrmCard = () => {
  const [columns, setColumns] = useState({
    column1: getItems(5, "col1"),
    column2: getItems(5, "col2"),
    column3: getItems(5, "col3"),
    column4: getItems(5, "col3"),
    column5: getItems(5, "col3"),
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        columns[source.droppableId],
        source.index,
        destination.index
      );
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: items,
      }));
    } else {
      const result = move(
        columns[source.droppableId],
        columns[destination.droppableId],
        source,
        destination
      );
      setColumns((prev) => ({
        ...prev,
        ...result,
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
        }}
      >
        {Object.keys(columns).map((columnId) => (
          <Droppable
            key={columnId}
            droppableId={columnId}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getColumnStyle(snapshot.isDraggingOver)}
              >
                {columns[columnId].map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
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
                      >
                        <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: "bold",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            Elmer Coro Huaman{" "}
                            <Avatar
                              sx={{
                                marginLeft: "16px",
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                              }}
                            >
                              E
                            </Avatar>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            Hola me llamo Elmer tengo 20 años soy desarrollador
                            web ...
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <PhoneIcon
                              sx={{ marginRight: "8px", color: "black" }}
                            />
                            <Typography
                              variant="body2"
                              color="textPrimary"
                            >
                              +51 987 654 321
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <EmailIcon
                              sx={{ marginRight: "8px", color: "black" }}
                            />
                            <Typography
                              variant="body2"
                              color="textPrimary"
                            >
                              corohuamanelmer@gmail.com
                            </Typography>
                          </Box>
                        </Box>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default CrmCard;
