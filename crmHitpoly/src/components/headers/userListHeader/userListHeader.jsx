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
        sx={{ display: "flex", justifyContent: "space-between", padding: "0" }}
      >
        <div></div>
        {/* Botones */}
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            sx={{ mr: 2, fontWeight: "bold" }}
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
