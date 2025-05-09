import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import Layout from "../../components/layout/layout";
import { grey, blueGrey } from "@mui/material/colors";
import { slugify } from "./components/slugify"; // Asegúrate de que la ruta sea correcta

const ListaItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  backgroundColor: "#f4f4f4",
  transition: "transform 0.2s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
  },
}));

function Listas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userLists, setUserLists] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const storedLists = localStorage.getItem(`userLists_${user?.id}`);
    if (storedLists) {
      setUserLists(JSON.parse(storedLists));
    }
  }, [user]);

  const handleVerDetalles = (listSlug) => {
    navigate(`/listas/${listSlug}`);
  };

  const handleEliminarLista = (event, listSlug) => {
    event.stopPropagation();
    Swal.fire({
      title: "¿Eliminar lista?",
      text: "¿Estás seguro de que quieres eliminar esta lista?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedLists = { ...userLists };
        delete updatedLists[listSlug];
        setUserLists(updatedLists);
        localStorage.setItem(`userLists_${user?.id}`, JSON.stringify(updatedLists));
        Swal.fire("Eliminado", "La lista ha sido eliminada.", "success");
      }
    });
  };

  const handleEditarNombre = (event, listSlug, currentName) => {
    event.stopPropagation();
    setEditingId(listSlug);
    setEditedName(currentName);
  };

  const handleGuardarNombre = (oldSlug, oldName) => {
    if (editedName.trim()) {
      const newSlug = slugify(editedName);
      const updatedLists = { ...userLists };

      if (updatedLists[newSlug] && newSlug !== oldSlug) {
        Swal.fire("Error", "Ya existe una lista con ese nombre.", "error");
        return;
      }

      updatedLists[oldSlug].name = editedName;
      updatedLists[oldSlug].slug = newSlug;

      if (oldSlug !== newSlug) {
        updatedLists[newSlug] = updatedLists[oldSlug];
        delete updatedLists[oldSlug];
      }

      setUserLists(updatedLists);
      localStorage.setItem(`userLists_${user?.id}`, JSON.stringify(updatedLists));
      setEditingId(null);
      setEditedName("");
      Swal.fire("Guardado", "El nombre de la lista ha sido actualizado.", "success");
    } else {
      Swal.fire("Error", "El nombre de la lista no puede estar vacío.", "error");
    }
  };

  return (
    <Layout title={"Listas"}>
      <Paper
        sx={{
          p: 2,
          mt: 2,
          maxHeight: 600, // Establece un alto máximo
          overflowY: "auto", // Habilita el scroll vertical cuando sea necesario
          width: "100%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
        }}
      >
        {Object.keys(userLists).length > 0 ? (
          Object.entries(userLists).map(([slug, list]) => (
            <ListaItem key={slug} onClick={() => handleVerDetalles(slug)}>
              {editingId === slug ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    fullWidth
                    label="Nuevo nombre"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    size="small"
                  />
                  <IconButton
                    onClick={() => handleGuardarNombre(slug, list.name)}
                    aria-label="guardar"
                  >
                    <CheckIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => setEditingId(null)}
                    aria-label="cancelar"
                  >
                    <CloseIcon color="action" />
                  </IconButton>
                </div>
              ) : (
                <>
                  <div style={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#0A2E45" }}
                    >
                      {list.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6C757D" }}>
                      {list.prospectIds.length} prospectos registrados
                    </Typography>
                  </div>
                  <div>
                    <IconButton
                      onClick={(event) => handleEditarNombre(event, slug, list.name)}
                      aria-label="editar"
                      sx={{ color: blueGrey[500], mx: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleEliminarLista(event, slug)}
                      aria-label="eliminar"
                      sx={{ color: grey[600], mx: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </ListaItem>
          ))
        ) : (
          <Typography color={grey[600]}>
            No has creado ninguna lista aún.
          </Typography>
        )}
      </Paper>
      <Button
        onClick={() => navigate("/usuarios")}
        sx={{ mt: 2 }}
        variant="outlined"
        color="primary"
      >
        Volver a la Tabla de Prospectos
      </Button>
    </Layout>
  );
}

export default Listas;