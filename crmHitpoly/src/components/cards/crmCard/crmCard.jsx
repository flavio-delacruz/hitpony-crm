import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FixedSizeList as List } from "react-window";

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (draggableStyle, isDragging) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const Row = ({ data, index, style }) => {
  const item = data[index];

  if (!item) {
    return null;
  }

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      key={item.id}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...getItemStyle(provided.draggableProps.style, snapshot.isDragging),
            ...style,
          }}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

const CrmCard = () => {
  const [items, setItems] = useState(getItems(10));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={getItemStyle(
              provided.draggableProps.style,
              snapshot.isDragging
            )}
          >
            {items[rubric.source.index].content}
          </div>
        )}
      >
        {(provided, snapshot) => {
          const itemCount = snapshot.isUsingPlaceholder
            ? items.length + 1
            : items.length;

          return (
            <List
              height={500}
              itemCount={itemCount}
              itemSize={50}
              width="100%"
              outerRef={provided.innerRef}
              itemData={items}
            >
              {Row}
            </List>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export default CrmCard;
