import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { PALETA } from "../../../theme/paleta";

const R = 24; // radio ovalado consistente

const ContentCard = ({ title, subtitle, children, gridSize = 12 }) => {
  return (
    <Card
      component={motion.div}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      sx={{
        position: "relative",
        overflow: "hidden",               // mantiene el ovalado
        background: "#FFFFFF",            // modo claro 100%
        border: `1px solid ${PALETA.border}`,
        borderRadius: R,                  // OVALADO
        boxShadow: PALETA.shadow,
        // asegura que el fondo no invada el borde degradado
        backgroundClip: "padding-box",
      }}
    >
      {/* Borde degradado animado (debajo del contenido) */}
      <Box
        component={motion.div}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          inset: 0,
          p: "1px",
          borderRadius: R,
          background: PALETA.gradEdgeSoft,  // Azul cielo → Cián → Violeta
          backgroundSize: "220% 220%",
          opacity: 0.8,
          // máscara para que sólo se vea como borde
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,                        // ¡clave! queda detrás del contenido
        }}
      />

      {/* Cabecera */}
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              color: PALETA.text,
              fontWeight: 800,
              // sutil glow en color
              textShadow: `0 0 8px ${PALETA.glowCyan}, 0 0 6px ${PALETA.glowPurple}`,
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{
              // subheader en violeta/azul degradado
              background: "linear-gradient(90deg, #00C2FF, #6C4DE2)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            {subtitle}
          </Typography>
        }
        sx={{
          pb: 0.5,
          px: 4, // **Ajuste para títulos de tabla**
          position: "relative",
          zIndex: 1,         // por encima del borde animado
        }}
      />

      {/* Contenido (Ajuste clave para la tabla) */}
      <CardContent
        sx={{
          pt: 1,
          px: 4, // **Ajuste principal para contenido de tabla**
          pb: 2,
          position: "relative",
          zIndex: 1,         // por encima del borde animado
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ContentCard;