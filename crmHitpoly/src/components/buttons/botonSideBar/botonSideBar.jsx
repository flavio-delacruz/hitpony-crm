import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BotonSideBar = ({ text, Icon, to, isSelected, onClick }) => {
  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
    >
      <Box
        onClick={onClick}
        mt={2}
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: isSelected ? "hsl(348, 85%, 62%)" : "transparent",
          "&:hover": {
            backgroundColor: "hsl(348, 85%, 62%)",
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#FFF",
            padding: "0px",
            margin: "0px",
          }}
          variant="body1"
          gutterBottom
        >
          {text}
        </Typography>
        {Icon && <Icon sx={{ color: "#FFF" }} />}
      </Box>
    </Link>
  );
};

export default BotonSideBar;
