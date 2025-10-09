import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { BarChart } from "@mui/x-charts/BarChart";
import { PALETA } from "../../../theme/paleta";

// márgenes de fallback (si no pudiéramos leer el plot real)
const FALLBACK_MARGIN = { left: 56, right: 20, top: 20, bottom: 40 };

const ChartCard = ({ title, subtitle, titleChart, series = [], xAxis = [] }) => {
  const safeSeries = series.length ? series : [{ data: [0, 0, 0, 0] }];
  const safeXAxis  = xAxis.length  ? xAxis  : [{ data: ["", "", "", ""] }];

  const isEmpty = safeSeries.every((s) => (s.data || []).every((v) => v === 0));

  // --- medir el área de plot REAL del BarChart ---
  const containerRef = useRef(null);
  const [plotRect, setPlotRect] = useState(null); // {top,left,width,height}

  const measurePlot = () => {
    const el = containerRef.current;
    if (!el) return;

    // MUI X crea este overlay para interacciones, es exactamente el área de plot
    const plot = el.querySelector(".MuiChartsPlotArea-root");
    const cbox = el.getBoundingClientRect();

    if (plot) {
      const pbox = plot.getBoundingClientRect();
      setPlotRect({
        top: pbox.top - cbox.top,
        left: pbox.left - cbox.left,
        width: pbox.width,
        height: pbox.height,
      });
    } else {
      // fallback si la clase cambia en alguna versión
      setPlotRect({
        top: FALLBACK_MARGIN.top,
        left: FALLBACK_MARGIN.left,
        width: Math.max(0, cbox.width - FALLBACK_MARGIN.left - FALLBACK_MARGIN.right),
        height: Math.max(0, cbox.height - FALLBACK_MARGIN.top - FALLBACK_MARGIN.bottom),
      });
    }
  };

  useEffect(() => {
    measurePlot();
    // re-medimos tras pintar y en resize
    const r = new ResizeObserver(() => measurePlot());
    if (containerRef.current) r.observe(containerRef.current);

    // también reintenta un par de veces por si el svg se monta después
    const t1 = setTimeout(measurePlot, 50);
    const t2 = setTimeout(measurePlot, 200);

    return () => {
      r.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Card
      component={motion.div}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      sx={{
        background: "#FFFFFF",
        border: `1px solid ${PALETA.border}`,
        borderRadius: 24,
        overflow: "visible",
        position: "relative",
        boxShadow: PALETA.shadow,
      }}
    >
      {/* AJUSTE DE TÍTULOS: Usamos px: 4 (32px) para más espacio horizontal */}
      <Box sx={{ px: 4, pt: 2 }}> 
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

      <CardContent sx={{ pt: 1, position: "relative" }}>
        <Box ref={containerRef} sx={{ height: 260, position: "relative" }}>
          <BarChart
            series={safeSeries}
            xAxis={safeXAxis}
            colors={["#00C2FF", "#0B8DB5", "#6C4DE2"]}
            slotProps={{ legend: { labelStyle: { fill: PALETA.text } } }}
            yAxis={[{ min: 0, max: isEmpty ? 1 : undefined }]}
            margin={FALLBACK_MARGIN}
            sx={{
              "--Charts-axisLineColor": PALETA.borderSoft,
              "--Charts-tickColor": PALETA.borderSoft,
              "--Charts-axisLabelColor": PALETA.text,
              "--Charts-gridColor": "rgba(33,30,38,.10)",
              background: "transparent",
            }}
          />

          {/* overlay centrado EXACTO dentro del área de plot real */}
          {isEmpty && plotRect && (
            <Box
              sx={{
                position: "absolute",
                // Ajuste para centrar el mensaje de "Sin datos todavía"
                top: plotRect.top - 5, 
                left: plotRect.left - 5,
                width: plotRect.width + 10, 
                height: plotRect.height + 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 2,
                textAlign: "center",
                borderRadius: 18,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 14, sm: 16 },
                  lineHeight: 1.2,
                  background: "linear-gradient(90deg,#00C2FF 0%, #6C4DE2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 6px rgba(108,77,226,.15)",
                }}
              >
                Sin datos todavía
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;