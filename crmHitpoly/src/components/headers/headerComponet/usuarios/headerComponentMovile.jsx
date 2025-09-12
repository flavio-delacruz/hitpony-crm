// HeaderComponentMovile.js
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Drawer, useMediaQuery, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People"; // Nuevo ícono para colaboradores
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import SideBarContent from "../../../sideBar/sideBarContent";
import NotificationComponent from "../components/NotificationComponent";
import Search from "../../../search/SearchComponent"; 
import { useAuth } from "../../../../context/AuthContext";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "20px",
});

const HeaderComponentMovile = ({ title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Condición para mostrar el botón de colaboradores
  const isCollaboratorButtonVisible = Number(user?.id_tipo) === 4;

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleAccountClick = () => navigate("/perfil");

  // Nuevo manejador para el botón de colaboradores
  const handleCollabClick = () => {
    navigate("/gestor-de-asignaciones");
  };

  return (
    <Header>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <SideBarContent />
      </Drawer>
      <Box sx={{ display: "flex", mr: 2 }}>
        <Search />
      </Box>

      <Box display="flex" alignItems="center">
        <IconButton>
          <NotificationComponent />
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

export default HeaderComponentMovile;