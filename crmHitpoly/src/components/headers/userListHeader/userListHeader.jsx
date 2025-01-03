import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const UserListHeader = ({ pageName, userCount, onAddNew, onShareForm }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (filter) => {
    console.log(`Filtro seleccionado: ${filter}`);
    handleClose();
  };

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
        {/* Nombre de la página */}
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ textTransform: "none" }}
          >
            Filtrar
            <FilterAltIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => handleFilter("Categoría 1")}>
              <Typography variant="body1">Categoría 1</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilter("Categoría 2")}>
              <Typography variant="body1">Categoría 2</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilter("Categoría 3")}>
              <Typography variant="body1">Categoría 3</Typography>
            </MenuItem>
          </Menu>
        </div>
        {/* Botones */}
        <Box>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserListHeader;
