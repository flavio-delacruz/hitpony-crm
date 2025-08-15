// src/components/SearchSetterControl.jsx
import React from "react";
import { TextField, Box } from "@mui/material";

const SearchSetterControl = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TextField
        label="Buscar Setter"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Box>
  );
};

export default SearchSetterControl;