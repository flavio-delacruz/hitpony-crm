// features/login/NeonButton.jsx
import { Button } from "@mui/material";
import { brand } from "../../theme";

export default function NeonButton({ onClick, children }) {
  return (
    <Button
      fullWidth
      size="large"
      onClick={onClick}
      sx={{
        mt: 0.5,
        mb: 0.5,
        py: 1.2,
        fontWeight: 800,
        letterSpacing: ".03em",
        borderRadius: 999,
        position: "relative",
        zIndex: 1,
        background: `linear-gradient(90deg,${brand.cyan} 0%, ${brand.blue} 40%, ${brand.pink} 100%)`,
        color: "#0a0c13",
        boxShadow: `0 12px 35px ${brand.blue}40, 0 10px 35px ${brand.pink}33`,
        "&:hover": {
          filter: "brightness(1.05)",
          boxShadow: `0 16px 45px ${brand.blue}66, 0 12px 45px ${brand.pink}55`,
        },
      }}
    >
      {children}
    </Button>
  );
}
