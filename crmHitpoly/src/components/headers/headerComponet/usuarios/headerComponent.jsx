// HeaderComponent.js
import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { styled } from '@mui/material/styles';
import Search from "../../../search/SearchComponent";
import NotificationComponent from "../components/NotificationComponent";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  marginBottom: "20px",
});

const HeaderComponent = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Condición para mostrar el botón de colaboradores
  // Se asume que el id_tipo 4 corresponde a "cliente"
  const isCollaboratorButtonVisible = user?.id_tipo === 4;

  const handleAccountClick = () => {
    navigate("/perfil");
  };

  const handleCollabClick = () => {
    navigate("/asignaciones");
  };

  return (
    <Header>
      <Box display="flex" alignItems="center">
        <Box sx={{marginRight: 2}}>
          <Search/>
        </Box>
        <IconButton>
          <NotificationComponent/>
        </IconButton>
        {isCollaboratorButtonVisible && (
          <IconButton onClick={handleCollabClick}>
            <PeopleIcon />
          </IconButton>
        )}
        <IconButton onClick={handleAccountClick}>
          <Avatar
            alt={user?.name || "Usuario"}
            src={user?.avatar}
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>
      </Box>
    </Header>
  );
};

export default HeaderComponent;