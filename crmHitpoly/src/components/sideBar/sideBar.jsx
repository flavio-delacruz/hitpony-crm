import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";

import BotonSideBar from "../buttons/botonSideBar/botonSideBar";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BackupTableIcon from "@mui/icons-material/BackupTable";

const Sidebar = styled(Box)({
  height: "auto",
  width: "280px",
  backgroundColor: "hsl(270, 7%, 17%)",
  borderRadius: "20px",
  padding: "20px",
  color: "#fff",
});

const buttons = [
  { text: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  { text: "Lista de Usuarios", icon: PeopleIcon, path: "/usuarios" },
  { text: "Contacto", icon: ContactPageIcon, path: "/contact" },
  { text: "Perfil", icon: AccountCircleIcon, path: "/perfil" },
  { text: "Metricas", icon: BackupTableIcon, path: "/metricas" },
];

const SideBar = () => {
  return (
    <Sidebar sx={{ margin: "20px" }}>
      <Typography
        sx={{ fontWeight: "bold", color: "#FFF" }}
        variant="h5"
        gutterBottom
      >
        Hitpoly Dashboard
      </Typography>
      <Divider sx={{ backgroundColor: "#FFF" }} />
      <Box
        sx={{
          height: "auto",
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
            text="Cerrar sesion"
            Icon={BackupTableIcon}
          />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
