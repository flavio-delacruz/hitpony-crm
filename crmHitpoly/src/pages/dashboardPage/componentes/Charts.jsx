// src/pages/dashboardPage/componentes/Charts.jsx
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ChartCard from "../../../components/cards/chartCard/chartCard";
import { useProspectos } from "../../../context/ProspectosContext";

const getUI = () => ({
  sky:    "#00C2FF",
  cyan:   "#0B8DB5",
  purple: "#6C4DE2",
  panel:  "#FFFFFF",
  text:   "#211E26",
  border: "rgba(33,30,38,.15)",
});

// cuánto mover los títulos a la derecha (px)
const TITLE_SHIFT = 28;

/* ========= PANEL OVALADO con desplazamiento opcional del TÍTULO ========= */
const NeonPanel = ({ children, title, subtitle, titleOffsetX = 0 }) => {
  const ui = getUI();
  return (
    <Box
      component={motion.div}
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ rotateX: -2, rotateY: 2, transition: { type: "spring", stiffness: 120, damping: 16 } }}
      style={{ transformStyle: "preserve-3d" }}
      sx={{
        position: "relative",
        borderRadius: 24,
        background: ui.panel,
        p: 2,
        border: `1px solid ${ui.border}`,
        boxShadow: "0 8px 30px rgba(33,30,38,.08)",
        overflow: "visible",
      }}
    >
      {/* Glow degradado detrás */}
      <Box
        aria-hidden
        component={motion.div}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          inset: -2,
          borderRadius: 24,
          background: `linear-gradient(120deg, ${ui.sky}, ${ui.cyan} 35%, ${ui.purple} 80%, ${ui.sky})`,
          filter: "blur(8px)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Contenido */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {title && (
          <Box sx={{ mb: 0.25, transform: `translateX(${titleOffsetX}px)` }}>
            <Typography component="div" sx={{ fontWeight: 900, color: ui.text, lineHeight: 1.1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: ui.purple, display: "block", mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
};

const DashboardCharts = () => {
  const { prospectos } = useProspectos();

  const [prospectosPorMes, setProspectosPorMes] = useState({
    meses: [],
    totalPorMes: [],
    ganadosPorMes: [],
    perdidosPorMes: [],
  });
  const [porcentajes, setPorcentajes] = useState({
    total: "Cargando...",
    ganados: "Cargando...",
    perdidos: "Cargando...",
  });

  const buildMeses = () => {
    const hoy = new Date();
    const labels = [];
    for (let i = 3; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.toLocaleString("es-ES", { month: "short" });
      labels.push(`${mes} ${fecha.getFullYear()}`);
    }
    return labels;
  };

  useEffect(() => {
    const mesesLabels = buildMeses();

    if (!prospectos || prospectos.length === 0) {
      setProspectosPorMes({
        meses: mesesLabels,
        totalPorMes: [0, 0, 0, 0],
        ganadosPorMes: [0, 0, 0, 0],
        perdidosPorMes: [0, 0, 0, 0],
      });
      setPorcentajes({
        total: "Sin variación (0)",
        ganados: "Sin variación (0)",
        perdidos: "Sin variación (0)",
      });
      return;
    }

    const hoy = new Date();
    const totalPorMes = Array(4).fill(0);
    const ganadosPorMes = Array(4).fill(0);
    const perdidosPorMes = Array(4).fill(0);

    prospectos.forEach((p) => {
      const fecha = new Date(p.created_at);
      const estado = p.estado_contacto?.toLowerCase().trim();
      const diff =
        hoy.getMonth() - fecha.getMonth() +
        12 * (hoy.getFullYear() - fecha.getFullYear());
      if (diff >= 0 && diff < 4) {
        const idx = 3 - diff;
        totalPorMes[idx]++;
        if (estado === "ganado") ganadosPorMes[idx]++;
        if (estado === "perdido") perdidosPorMes[idx]++;
      }
    });

    setProspectosPorMes({ meses: mesesLabels, totalPorMes, ganadosPorMes, perdidosPorMes });

    const pct = (cur, prev) => {
      if (prev === 0) return cur > 0 ? "+100% respecto al mes pasado" : "0% respecto al mes pasado";
      const v = ((cur - prev) / prev) * 100;
      return `${v >= 0 ? "+" : ""}${v.toFixed(1)}% respecto al mes pasado`;
    };
    setPorcentajes({
      total: pct(totalPorMes[3], totalPorMes[2]),
      ganados: pct(ganadosPorMes[3], ganadosPorMes[2]),
      perdidos: pct(perdidosPorMes[3], perdidosPorMes[2]),
    });
  }, [prospectos]);

  const { meses, totalPorMes, ganadosPorMes, perdidosPorMes } = prospectosPorMes;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        gap: 2,
        mb: 2,
        background: "#FFFFFF",
        borderRadius: 24,
      }}
    >
      {/* Todos los prospectos (ya estaba) */}
      <NeonPanel title="Todos los prospectos" subtitle={porcentajes.total} titleOffsetX={TITLE_SHIFT}>
        <ChartCard
          series={[{ data: totalPorMes || [0,0,0,0] }]}
          xAxis={[{ data: meses || ["", "", "", ""] }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>

      {/* Prospectos Ganados → desplazado también */}
      <NeonPanel title="Prospectos Ganados" subtitle={porcentajes.ganados} titleOffsetX={TITLE_SHIFT}>
        <ChartCard
          series={[{ data: ganadosPorMes || [0,0,0,0] }]}
          xAxis={[{ data: meses || ["", "", "", ""] }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>

      {/* Prospectos Perdidos → desplazado también */}
      <NeonPanel title="Prospectos Perdidos" subtitle={porcentajes.perdidos} titleOffsetX={TITLE_SHIFT}>
        <ChartCard
          series={[{ data: perdidosPorMes || [0,0,0,0] }]}
          xAxis={[{ data: meses || ["", "", "", ""] }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>
    </Box>
  );
};

export default DashboardCharts;
