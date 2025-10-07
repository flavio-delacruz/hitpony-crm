import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { PALETA } from "../../../theme/paleta";

const ChartCard = ({ title, subtitle, titleChart, series, xAxis }) => {
  return (
    <Card
      component={motion.div}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      sx={{
        background: PALETA.white,            // ← BLANCO, sin degradados grises/negros
        border: `1px solid ${PALETA.border}`,
      }}
    >
      <Box sx={{ px: 2, pt: 2 }}>
        {titleChart && (
          <Typography variant="overline" sx={{ color: PALETA.sky, letterSpacing: ".08em" }}>
            {titleChart}
          </Typography>
        )}
        {title && (
          <Typography variant="subtitle1" sx={{ color: PALETA.text, fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" sx={{ color: PALETA.purple }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <CardContent sx={{ pt: 1 }}>
        {/* Ejemplo para @mui/x-charts (colores legibles en blanco) */}
        {/*
          <BarChart
            series={series}
            xAxis={xAxis}
            colors={['#00C2FF','#0B8DB5','#6C4DE2']} // Azul Cielo, Cián, Violeta
            slotProps={{ legend: { labelStyle: { fill: PALETA.text } } }}
            sx={{
              "--Charts-axisLineColor": PALETA.borderSoft,
              "--Charts-tickColor": PALETA.borderSoft,
              "--Charts-axisLabelColor": PALETA.text,
              "--Charts-gridColor": "rgba(33,30,38,.10)",
              background: "transparent",
              borderRadius: 8,
            }}
          />
        */}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
