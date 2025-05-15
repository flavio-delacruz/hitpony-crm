import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, Typography, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";

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

const CrmItem = ({ item, index }) => {
  const navigate = useNavigate();

  const handleSelectProspecto = (id) => {
    if (id) {
      navigate(`/pagina-de-contacto/${id}`);
    }
  };

  return (
    <Draggable draggableId={String(item.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
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
  );
};

export default CrmItem;