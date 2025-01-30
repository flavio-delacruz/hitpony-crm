import { AppBar, Toolbar, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";

const UserListHeader = ({ onAddNew, onShareForm }) => {
  return (
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
        {/* Botones */}
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
            width={{ xs: "100%", sm: "auto" }}
            sx={{ fontWeight: "bold" }}
          >
            Agregar Nuevo
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ShareIcon />}
            onClick={onShareForm}
            sx={{ fontWeight: "bold" }}
          >
            Compartir Formulario
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserListHeader;
