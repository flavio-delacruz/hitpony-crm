// HeaderComponentMovile.js
import { useState } from "react";
import { Box, Typography, IconButton, Drawer, useMediaQuery, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import SideBarContent from "../../sideBar/sideBarContent";
import NotificationComponent from "./components/NotificationComponent";
import Search from "../../search/SearchComponent"; // Asegúrate que esté importado correctamente
import { useAuth } from "../../../context/AuthContext"; // Para obtener el usuario

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

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleAccountClick = () => navigate("/perfil");

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

      <Typography sx={{ fontWeight: "bold", color: "#000", flex: 1, ml: 2 }} variant="h6">
        Página / {title}
      </Typography>

      {/* Buscador (puedes ocultarlo si no cabe en pantallas muy pequeñas) */}
      <Box sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}>
        <Search />
      </Box>

      <Box display="flex" alignItems="center">
        <IconButton>
          <NotificationComponent />
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

export default HeaderComponentMovile;
