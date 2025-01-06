import { useState } from "react";
import { Box, Card, Typography, Avatar } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Layout from "../../components/layout/layout";

const initialData = {
  reciente: [
    {
      id: "1",
      nombre: "Elmer Coro",
      correo: "elmer@example.com",
      telefono: "123456789",
    },
    {
      id: "2",
      nombre: "Elmer Coro",
      correo: "elmer2@example.com",
      telefono: "987654321",
    },
  ],
  andamento: [
    {
      id: "3",
      nombre: "Elmer Coro",
      correo: "elmer3@example.com",
      telefono: "456789123",
    },
  ],
  pendiente: [
    {
      id: "4",
      nombre: "Elmer Coro",
      correo: "elmer4@example.com",
      telefono: "789123456",
    },
  ],
  concluidos: [
    {
      id: "5",
      nombre: "Elmer Coro",
      correo: "elmer5@example.com",
      telefono: "321654987",
    },
  ],
};

const CrmPage = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = Array.from(data[source.droppableId]);
    const destList = Array.from(data[destination.droppableId]);

    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    setData({
      ...data,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    });
  };

  return (
    <Layout title={"Crm"}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          display="flex"
          justifyContent="space-between"
          padding={2}
        >
          {Object.keys(data).map((columnId) => (
            <Droppable
              key={columnId}
              droppableId={columnId}
            >
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width="22%"
                  padding={2}
                  border="1px solid #ccc"
                  borderRadius="8px"
                >
                  <Typography
                    variant="h6"
                    textAlign="center"
                    gutterBottom
                  >
                    {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                  </Typography>
                  {data[columnId].map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: "16px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap="8px"
                          >
                            <Avatar>{item.nombre.charAt(0)}</Avatar>
                            <Typography variant="body1">
                              {item.nombre}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            Correo: {item.correo}
                          </Typography>
                          <Typography variant="body2">
                            Teléfono: {item.telefono}
                          </Typography>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Layout>
  );
};

export default CrmPage;
