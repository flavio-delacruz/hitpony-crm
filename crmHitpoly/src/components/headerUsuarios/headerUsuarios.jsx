import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const HeaderUsuarios = ({ pageTitle, userCount }) => {
  const handleAddUser = () => {
    // Lógica para agregar un usuario
    console.log("Agregar usuario");
  };

  const handleShareForm = () => {
    // Lógica para compartir el formulario
    console.log("Compartir formulario");
  };

  return (
    <AppBar
      sx={{ color: "#000" }}
      position="static"
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Button
            color="inherit"
            onClick={handleAddUser}
          >
            Agregar Usuario
          </Button>
          <Button
            color="inherit"
            onClick={handleShareForm}
            sx={{ marginLeft: 2 }}
          >
            Compartir Formulario
          </Button>
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {pageTitle}
        </Typography>
        <Typography
          variant="body1"
          color="inherit"
        >
          Usuarios: {userCount}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderUsuarios;
