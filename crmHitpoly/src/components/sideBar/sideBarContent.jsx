import { useState } from "react";
import { Box, Divider } from "@mui/material";
import { styled } from "@mui/system";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BotonSideBar from "../buttons/botonSideBar/botonSideBar";
import LogoutModal from "../modals/logoutModal/logoutModal";
import LogoHitpoly from "../../../public/LogoHitpoly";
import {useAuth }from "../../context/AuthContext"

const SidebarContainer = styled(Box)({
  height: "100vh",
  width: "280px",
  backgroundColor:"#2D1638",
  padding: "20px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
});

const buttons = [
  { text: "Inicio", icon: HomeIcon, path: "/dashboard" },
  { text: "Usuarios", icon: PeopleIcon, path: "/usuarios" },
  { text: "Crm", icon: ContactPageIcon, path: "/crm" },
  { text: "Metricas", icon: AssessmentIcon, path: "/metricas" },
];
const SideBarContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {  user } = useAuth();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  

  return (
    <SidebarContainer>
      <div>
        <LogoHitpoly />
        <Divider
          sx={{
            backgroundColor: "#FFF",
            marginBottom: "20px",
          }}
        />
      </div>

      <Box sx={{ flexGrow: 1 }}>
        {buttons.map((button) => (
          <BotonSideBar
            key={button.path}
            text={button.text}
            Icon={button.icon}
            to={button.path}
            isSelected={location.pathname === button.path}
          />
        ))}
      </Box>
      <Box>
        <BotonSideBar
          text="Cerrar sesión"
          Icon={ExitToAppIcon}
          onClick={handleOpenModal}
        />
      </Box>

      <LogoutModal
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
    </SidebarContainer>
  );
};

export default SideBarContent;
