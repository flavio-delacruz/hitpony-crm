import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

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
  width: 250,
  minHeight: 500,
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 16,
  margin: "0 0 8px 0",
  background: isDragging ? "lightgreen" : "white",
  border: "1px solid grey",
  ...draggableStyle,
});

const CrmCard = () => {
  const [columns, setColumns] = useState({
    column1: getItems(5, "col1"),
    column2: getItems(5, "col2"),
    column3: getItems(5, "col3"),
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
      <div style={{ display: "flex", gap: "16px" }}>
        {Object.keys(columns).map((columnId) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getColumnStyle(snapshot.isDraggingOver)}
              >
                {columns[columnId].map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        {item.content}
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
