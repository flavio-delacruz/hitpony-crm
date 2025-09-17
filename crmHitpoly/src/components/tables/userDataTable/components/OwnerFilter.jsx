import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const OwnerFilter = ({ onFilterChange }) => {
  const [filterValue, setFilterValue] = useState('');

  const handleClear = () => {
    setFilterValue('');
    onFilterChange('');
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    onFilterChange(value);
  };

  return (
    <TextField
      fullWidth
      variant="standard"
      value={filterValue}
      onChange={handleChange}
      placeholder="Buscar propietario"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: filterValue && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default OwnerFilter;