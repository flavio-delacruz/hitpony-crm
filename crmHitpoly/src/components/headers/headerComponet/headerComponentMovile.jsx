import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Drawer, useMediaQuery } from "@mui/material";
import SideBarContent from "../../sideBar/sideBarContent";
import MenuIcon from "@mui/icons-material/Menu";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "20px",
});

const HeaderComponentMovile = ({ title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Header>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }} // Mejora el rendimiento en móviles
      >
        <SideBarContent />
      </Drawer>
      <Typography
        sx={{ fontWeight: "bold", color: "#000" }}
        variant="h6"
      >
        Pagina / {title}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
      >
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <SettingsIcon />
        </IconButton>
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </Header>
  );
};

export default HeaderComponentMovile;
