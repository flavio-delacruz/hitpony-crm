import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BotonSideBar = ({ text, Icon, to, isSelected }) => {
  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
    >
      <Box
        mt={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: isSelected ? "hsl(348, 85%, 62%)" : "transparent",
          "&:hover": {
            backgroundColor: "hsl(348, 85%, 62%)",
          },
        }}
      >
        <Typography
          sx={{ fontWeight: "bold", color: "#FFF" }}
          variant="body1"
          gutterBottom
        >
          {text}
        </Typography>
        {Icon && <Icon />}
      </Box>
    </Link>
  );
};

export default BotonSideBar;
