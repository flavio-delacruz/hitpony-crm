// CrmCard.js
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
    nutrición: [],
    interesado: [],
    agendado: [],
    ganado: [],
    seguimiento: [],
    perdido: [],
  });
  const containerRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadProspectos = async () => {
      console.log("useEffect: Iniciando carga de prospectos");
      const prospectosData = await fetchProspectos();
      if (prospectosData) {
        const organizedColumns = {
          leads: [],
          nutrición: [],
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

        if (!isInitialLoad.current) {
          console.log("useEffect: Actualizando estado de columnas (no carga inicial)", organizedColumns);
          setColumns(organizedColumns);
        } else {
          console.log("useEffect: Carga inicial de columnas", organizedColumns);
        }
        isInitialLoad.current = false;
      } else {
        console.log("useEffect: No se recibieron datos de prospectos");
      }
    };

    loadProspectos();
  }, [fetchProspectos]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const movedItem = columns[source.droppableId][source.index];

    // 1. Actualización optimista INMEDIATA
    const newColumnsState = (prev) => {
      const sourceClone = [...prev[source.droppableId]];
      const destClone = [...prev[destination.droppableId]];
      const [removed] = sourceClone.splice(source.index, 1);
      destClone.splice(destination.index, 0, removed);
      const newState = {
        ...prev,
        [source.droppableId]: sourceClone,
        [destination.droppableId]: destClone,
      };
      console.log("onDragEnd: Actualización optimista del estado", newState);
      return newState;
    };
    setColumns(newColumnsState);

    // 2. Llamada asíncrona a la API
    const updateResult = await updateProspectoEstado(
      movedItem.id,
      destination.droppableId
    );

    // 3. Manejar la respuesta de la API
    if (!updateResult.success) {
      console.log("onDragEnd: Revertiendo la actualización optimista recargando datos");
      loadProspectos();
    } else {
      console.log("onDragEnd: Actualización exitosa en la API");
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