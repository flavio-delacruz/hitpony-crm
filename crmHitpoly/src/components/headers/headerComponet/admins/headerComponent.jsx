// src/components/layout/HeaderComponent.jsx

import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { styled } from '@mui/material/styles';
import NotificationComponent from "../components/NotificationComponent";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  // ✅ Alinea todo el contenido a la derecha
  justifyContent: "flex-end",
  marginBottom: "20px",
});

const HeaderComponent = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccountClick = () => {
    navigate("/perfil");
  };

  return (
    <Header>
      {/* El Box de alineación no es necesario, el Header lo gestiona ahora */}
      <IconButton>
        <NotificationComponent/>
      </IconButton>
      <IconButton>
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={handleAccountClick}>
        <Avatar
          alt={user?.name || "Usuario"}
          src={user?.avatar}
          sx={{ width: 32, height: 32 }}
        />
      </IconButton>
    </Header>
  );
};

export default HeaderComponent;