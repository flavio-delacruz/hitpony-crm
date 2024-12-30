import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";

const UserListHeader = ({ pageName, userCount, onAddNew, onShareForm }) => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        border: "none",
        marginBottom: "20px",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ padding: "0" }}>
        {/* Nombre de la página */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          {pageName}
          <Box
            component="span"
            sx={{ ml: 2, display: "flex", alignItems: "center" }}
          >
            <PersonIcon sx={{ mr: 0.5 }} />
            {userCount}
          </Box>
        </Typography>

        {/* Botones */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{ mr: 2 }}
        >
          Agregar Nuevo
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ShareIcon />}
          onClick={onShareForm}
        >
          Compartir Formulario
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default UserListHeader;
