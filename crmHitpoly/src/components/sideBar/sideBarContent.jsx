import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BotonSideBar from "../buttons/botonSideBar/botonSideBar";
import LogoutModal from "../modals/logoutModal/logoutModal";

const SidebarContainer = styled(Box)({
  height: "100%",
  width: "280px",
  backgroundColor: "hsl(270, 7%, 17%)",
  borderRadius: "20px",
  padding: "20px",
  color: "#fff",
});

const buttons = [
  { text: "Inicio", icon: HomeIcon, path: "/dashboard" },
  { text: "Usuarios", icon: PeopleIcon, path: "/usuarios" },
  { text: "Crm", icon: ContactPageIcon, path: "/crm" },
  { text: "Metricas", icon: AssessmentIcon, path: "/metricas" },
  { text: "Perfil", icon: AccountCircleIcon, path: "/perfil" },
];
const SideBarContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <SidebarContainer>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#FFF",
          padding: "30px",
          textAlign: "center",
        }}
        variant="h5"
        gutterBottom
      >
        Hitpoly Dashboard
      </Typography>
      <Divider
        sx={{
          backgroundColor: "#FFF",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      />
      <Box
        sx={{
          height: "87%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
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
      </Box>
      <LogoutModal
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
    </SidebarContainer>
  );
};

export default SideBarContent;
