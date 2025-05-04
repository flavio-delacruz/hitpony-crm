import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterUsuarios from "../filter/filterUsuarios/filterUsuarios";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    option1: false,
    option2: false,
  });

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        marginBottom: "20px",
        borderRadius: "8px",
      }}
      position="static"
    >
      <Toolbar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FilterUsuarios />
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterOptions.option1}
                    onChange={handleCheckboxChange}
                    name="option1"
                  />
                }
                label="Opción 1"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterOptions.option2}
                    onChange={handleCheckboxChange}
                    name="option2"
                  />
                }
                label="Opción 2"
              />
            </MenuItem>
          </Menu>
        </div>
        <Typography
          variant="h6"
          style={{ flexGrow: 1 }}
        >
          Mi Aplicación
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            type="submit"
            aria-label="search"
            color="inherit"
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
