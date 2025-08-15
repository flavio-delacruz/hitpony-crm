// HeaderComponent.js
import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { styled } from '@mui/material/styles';
import Search from "../../../search/SearchComponent";
import NotificationComponent from "../components/NotificationComponent";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
      <Typography sx={{ fontWeight: "bold", color: "#000" }} variant="h6">
        Página / {title}
      </Typography>
      <Box display="flex" alignItems="center">
        <Box sx={{marginRight: 2}}>
        <Search/>
        </Box>
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
      </Box>
    </Header>
  );
};

export default HeaderComponent;
