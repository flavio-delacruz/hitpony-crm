import React, { useState, useEffect, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import useProspectos from "./components/prospectosService";
import useUpdateProspecto from "./components/updateProspectoService";
import CrmColumn from "./components/CrmColumn";

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

const CrmCard = () => {
  const { fetchProspectos } = useProspectos();
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

  const loadProspectos = async () => {
    const prospectosData = await fetchProspectos();

    if (prospectosData) {
      const organizedColumns = {
        leads: [],
        nutricion: [],
        interesado: [],
        agendado: [],
        ganado: [],
        seguimiento: [],
        perdido: [],
      };

      prospectosData.forEach((p) => {
        const estado = p.estado_contacto?.toLowerCase() || "leads";
        if (organizedColumns[estado]) {
          organizedColumns[estado].push(p);
        } else {
          organizedColumns["leads"].push(p);
        }
      });
      setColumns(organizedColumns);
    } else {
    }
  };

  useEffect(() => {
    loadProspectos();
  }, [fetchProspectos]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    if (
      sourceDroppableId === destinationDroppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const movedItem = columns[sourceDroppableId][source.index];

    setColumns((prev) => {
      let newColumns;
      if (sourceDroppableId === destinationDroppableId) {
        const items = reorder(
          prev[sourceDroppableId],
          source.index,
          destination.index
        );
        newColumns = {
          ...prev,
          [sourceDroppableId]: items,
        };
      } else {
        const result = move(
          prev[sourceDroppableId],
          prev[destinationDroppableId],
          source,
          destination
        );
        newColumns = {
          ...prev,
          [sourceDroppableId]: result[sourceDroppableId],
          [destinationDroppableId]: result[destinationDroppableId],
        };
      }
      return newColumns;
    });

    const updateResult = await updateProspectoEstado(
      movedItem.id,
      destinationDroppableId
    );
    if (!updateResult.success) {
    } else {
    }
  };

  const handleWheel = (e, columnId) => {
    const columnElement = document.getElementById(columnId);
    if (columnElement) {
      columnElement.scrollTop += e.deltaY;
    }
  };

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
          <CrmColumn
            key={columnId}
            columnId={columnId}
            items={items}
            onWheel={handleWheel}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default CrmCard;
