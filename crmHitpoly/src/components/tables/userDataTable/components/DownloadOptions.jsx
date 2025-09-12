// src/components/tables/userDataTable/components/DownloadOptions.jsx

import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TableChartIcon from "@mui/icons-material/TableChart";
import { blue } from "@mui/material/colors";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const excelBlue = blue[700];

const DownloadOptions = ({ anchorEl, handleClose, prospectsToDownload }) => {
  const downloadAsCsv = () => {
    const csv = Papa.unparse(prospectsToDownload);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "prospectos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const downloadAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(prospectsToDownload);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prospectos");
    XLSX.writeFile(wb, "prospectos.xlsx");
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "download-button",
      }}
    >
      <MenuItem onClick={downloadAsCsv}>
        <ListItemIcon>
          <InsertDriveFileIcon color="action" />
        </ListItemIcon>
        <ListItemText primary="Descargar como CSV" />
      </MenuItem>
      <MenuItem onClick={downloadAsExcel}>
        <ListItemIcon>
          <TableChartIcon sx={{ color: excelBlue }} />
        </ListItemIcon>
        <ListItemText primary="Descargar como Excel" />
      </MenuItem>
    </Menu>
  );
};

export default DownloadOptions;