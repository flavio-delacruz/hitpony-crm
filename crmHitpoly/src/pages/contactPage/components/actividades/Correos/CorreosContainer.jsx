import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Typography, Modal, Divider } from "@mui/material";
import CorreosCard from "./CorreosCard";
import { useAuth } from "../../../../../context/AuthContext";
import Swal from "sweetalert2";

const API_URL = "https://apiweb.hitpoly.com/ajax/traerNotasController.php";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

// Función para agrupar notas por mes y año
const groupNotesByMonth = (notes) => {
  const grouped = {};
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  notes.forEach(note => {
    const date = new Date(note.created_at);
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const key = `${month} ${year}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(note);
  });
  return grouped;
};

export default function CorreosContainer({ prospectoId }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "getNotas", prospecto_id: prospectoId }),
      });
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        // Ordenar notas por fecha para la agrupación
        const sortedNotes = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotes(sortedNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error al obtener notas:", error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [prospectoId]);

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };
  
  const handleEditNote = (note) => {
      setSelectedNote(note);
      setIsModalOpen(true);
  };

  const handleNoteDeleted = (deletedId) => {
    setNotes(notes.filter((note) => note.id !== deletedId));
  };
  
  const handleNoteCreated = () => {
    setIsModalOpen(false);
    fetchNotes();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const groupedNotes = groupNotesByMonth(notes);

  return (
    <Box sx={{}}>
      {/* Posicionamos el botón a la derecha */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={handleAddNote}>
          Crear Correo
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {Object.keys(groupedNotes).length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                No hay notas para este prospecto.
              </Typography>
            </Grid>
          ) : (
            Object.keys(groupedNotes).map(monthYear => (
              <React.Fragment key={monthYear}>
                <Grid item xs={12}>               
                  <Divider sx={{ mt: 1, mb: 2 }} />
                </Grid>
                {groupedNotes[monthYear].map((note) => (
                  <Grid item xs={12} key={note.id}>
                    <NotaCard
                      initialNote={note}
                      prospectoId={prospectoId}
                      onNoteDeleted={handleNoteDeleted}
                      onNoteEdited={handleEditNote}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            ))
          )}
        </Grid>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <NotaCard
            initialNote={selectedNote || { id: null, titulo: "", contenido: "" }}
            prospectoId={prospectoId}
            onNoteCreated={handleNoteCreated}
            onCancel={handleCloseModal}
            isNew={!selectedNote}
          />
        </Box>
      </Modal>
    </Box>
  );
}