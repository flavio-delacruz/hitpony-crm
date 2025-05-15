import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const googleBlue = "#4285F4";

function ReusableTable({
  rows,
  columns,
  onRowSelectionChange,
  onCellClick,
  filterModel,
  onFilterModelChange,
  pageSizeOptions = [5, 10, 50, 100],
  initialPageSize = 10,
  rowHeight,
  onRowClick,
}) {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: initialPageSize,
    page: 0,
  });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const handleRowSelectionChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
    if (onRowSelectionChange) {
      onRowSelectionChange(newRowSelectionModel);
    }
  };

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelectionChange}
        rowSelectionModel={rowSelectionModel}
        onCellClick={onCellClick}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        {...(rowHeight && { rowHeight: Number(rowHeight) })}
        onRowClick={onRowClick}
        sx={{
          fontWeight: "bold",
          "& .MuiDataGrid-cell": {
            cursor: "pointer",
            transition: "color 0.3s",
          },
          "& .MuiDataGrid-cell:hover": {
            color: googleBlue,
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          border: "none",
        }}
      />
    </Paper>
  );
}

export default ReusableTable;