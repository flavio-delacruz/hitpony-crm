import React from "react";
import { TextField, Box } from "@mui/material";

const SearchProspectControl = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TextField
        label="Buscar Prospecto"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Box>
  );
};

export default SearchProspectControl;