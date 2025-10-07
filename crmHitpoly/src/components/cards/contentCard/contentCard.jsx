import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { PALETA } from "../../../theme/paleta";

const ContentCard = ({ title, subtitle, children, gridSize = 12 }) => {
  return (
    <Card
      component={motion.div}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${PALETA.border}`,
        background: PALETA.white,           // ← BLANCO puro (sin degradados oscuros)
      }}
    >
      {/* borde animado (suave para fondo blanco) */}
      <Box
        component={motion.div}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          inset: 0,
          p: "1px",
          borderRadius: 2,
          background: PALETA.gradEdgeSoft,
          backgroundSize: "220% 220%",
          opacity: .8,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: PALETA.text, textShadow: `0 0 8px ${PALETA.glowPurple}` }}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" sx={{ color: PALETA.cyan }}>
            {subtitle}
          </Typography>
        }
        sx={{ pb: 0.5 }}
      />

      <CardContent sx={{ pt: 1 }}>{children}</CardContent>
    </Card>
  );
};

export default ContentCard;
