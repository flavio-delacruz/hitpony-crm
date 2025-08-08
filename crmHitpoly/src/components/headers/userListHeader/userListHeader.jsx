import { useState } from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import ShareLinkModal from "../../forms/clientesPotenciales/ShareLinkModal";

const UserListHeader = ({ onAddNew }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{
          padding: "0px",
          border: "none",
          marginBottom: "20px",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            flexDirection: { sx: "column", md: "row" },
            width: "100%",
            padding: "0",
          }}
        >
          <div></div>
          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              gap: { xs: "0.5rem", md: "none" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddNew}
              sx={{ fontWeight: "bold" }}
            >
              Agregar Nuevo
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ShareIcon />}
              onClick={() => setShareModalOpen(true)}
              sx={{ fontWeight: "bold" }}
            >
              Compartir Formulario
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

     
      <ShareLinkModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
};

export default UserListHeader;
