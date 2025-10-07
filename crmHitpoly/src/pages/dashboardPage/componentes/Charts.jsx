import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ChartCard from "../../../components/cards/chartCard/chartCard";
import { useProspectos } from "../../../context/ProspectosContext";

/* =========================
   Paleta / helpers (modo claro)
========================= */
const getUI = () => ({
  sky:    "#00C2FF",             // Azul Cielo
  cyan:   "#0B8DB5",             // Cián Fugaz
  purple: "#6C4DE2",             // Violeta
  panel:  "#FFFFFF",             // BLANCO
  text:   "#211E26",             // Negro Noche
  border: "rgba(33,30,38,.15)",
  glowCyan:  "rgba(11,141,181,.35)",
  glowViolet:"rgba(108,77,226,.25)",
});

/* =========================
   Panel con borde animado + shimmer (claro)
========================= */
const NeonPanel = ({ children, title, subtitle }) => {
  const ui = getUI();
  return (
    <Box
      component={motion.div}
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{
        rotateX: -2,
        rotateY: 2,
        transition: { type: "spring", stiffness: 120, damping: 16 },
      }}
      style={{ transformStyle: "preserve-3d" }}
      sx={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        background: ui.panel,
        p: 2,
        border: `1px solid ${ui.border}`,
        boxShadow: "0 8px 30px rgba(33,30,38,.08)",
      }}
    >
      {/* Borde en gradiente animado (Azul Cielo → Cián → Violeta) */}
      <Box
        component={motion.div}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          p: "1px",
          background: `linear-gradient(120deg, ${ui.sky}, ${ui.cyan} 35%, ${ui.purple} 80%, ${ui.sky})`,
          backgroundSize: "220% 220%",
          opacity: 0.65,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      {/* Título con glow sutil */}
      {title && (
        <Box sx={{ mb: 0.25 }}>
          <Typography component="div" sx={{ fontWeight: 900, color: ui.text, lineHeight: 1.1 }}>
            {title.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i, type: "spring", stiffness: 240, damping: 18 }}
                style={{
                  textShadow:
                    `0 1px 0 rgba(255,255,255,.6), 0 0 12px ${ui.glowCyan}, 0 0 8px ${ui.glowViolet}`,
                  display: "inline-block",
                  fontSize: 16,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: ui.purple,
                textShadow: "0 0 6px rgba(108,77,226,.2)",
                display: "block",
                mt: 0.25,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Shimmer suave */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Box
          component={motion.div}
          initial={false}
          whileHover={{ x: ["-120%", "120%"] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "45%",
            transform: "skewX(-20deg)",
            background:
              "linear-gradient(120deg, transparent 0, rgba(0,194,255,.14) 20%, transparent 40%)",
          }}
        />
      </Box>

      {children}
    </Box>
  );
};

/* =========================
   Charts
========================= */
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

  useEffect(() => {
    if (!prospectos || prospectos.length === 0) {
      setProspectosPorMes({ meses: [], totalPorMes: [], ganadosPorMes: [], perdidosPorMes: [] });
      setPorcentajes({ total: "No hay datos", ganados: "No hay datos", perdidos: "No hay datos" });
      return;
    }

    const hoy = new Date();
    const mesesLabels = [];
    const totalPorMes = Array(4).fill(0);
    const ganadosPorMes = Array(4).fill(0);
    const perdidosPorMes = Array(4).fill(0);

    for (let i = 3; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.toLocaleString("es-ES", { month: "short" });
      mesesLabels.push(`${mes} ${fecha.getFullYear()}`);
    }

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
      }}
    >
      <NeonPanel title="Todos los prospectos" subtitle={porcentajes.total}>
        <ChartCard
          series={[{ data: totalPorMes }]}
          xAxis={[{ data: meses, scaleType: "band" }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>

      <NeonPanel title="Prospectos Ganados" subtitle={porcentajes.ganados}>
        <ChartCard
          series={[{ data: ganadosPorMes }]}
          xAxis={[{ data: meses, scaleType: "band" }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>

      <NeonPanel title="Prospectos Perdidos" subtitle={porcentajes.perdidos}>
        <ChartCard
          series={[{ data: perdidosPorMes }]}
          xAxis={[{ data: meses, scaleType: "band" }]}
          titleChart=""
          title="Desde los últimos 4 meses"
          subtitle=""
        />
      </NeonPanel>
    </Box>
  );
};

export default DashboardCharts;
