import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SideBarContent from "./sideBarContent";

const SideBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={toggleDrawer}
            sx={{ position: "fixed", top: 10, left: 10, zIndex: 1200 }}
          >
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
        </>
      ) : (
        <Box>
          <SideBarContent />
        </Box>
      )}
    </>
  );
};

export default SideBar;
