import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import Layout from "../../components/layout/layout";
import ShareIcon from "@mui/icons-material/Share";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

// 🌀 Animaciones
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   Paleta + helpers
========================= */
const getUI = (mode) => ({
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  pink: "#FF2D75",
  purple: "#6C4DE2",
  text: mode === "dark" ? "#E8ECF1" : "#0F172A",
  sub: mode === "dark" ? "#A7B1C1" : "#475569",
  grid: mode === "dark" ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)",
  panel: mode === "dark" ? "#0b0f14" : "#ffffff",
  cardShadow:
    mode === "dark"
      ? "0 18px 50px rgba(0,0,0,.55)"
      : "0 12px 30px rgba(0,0,0,.12)",
});

const containedGrad = (ui) => ({
  borderRadius: 999,
  px: 2.2,
  fontWeight: 800,
  letterSpacing: ".02em",
  color: "#0b0f14",
  background: `linear-gradient(90deg, ${ui.cyan} 0%, ${ui.blue} 45%, ${ui.pink} 100%)`,
  boxShadow: "0 10px 24px rgba(0,0,0,.25)",
  "&:hover": { filter: "brightness(1.06)" },
});
const outlinedGrad = (ui) => ({
  borderRadius: 999,
  px: 2.2,
  fontWeight: 800,
  letterSpacing: ".02em",
  color: ui.text,
  border: "1px solid transparent",
  background: `
    linear-gradient(${ui.panel}, ${ui.panel}) padding-box,
    linear-gradient(90deg, ${ui.cyan}, ${ui.blue} 55%, ${ui.pink}) border-box`,
  boxShadow: "0 6px 18px rgba(0,0,0,.15)",
  "&:hover": { color: ui.pink, filter: "brightness(1.05)" },
});

/* =========================
   Tooltip con delta ↑/↓ + animación
========================= */
const FancyTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload;
  const delta = p?.delta ?? 0;
  const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "•";
  const color = delta > 0 ? "#22C55E" : delta < 0 ? "#FF4D6D" : "#94A3B8";

  return (
    <Box component={motion.div}
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      sx={{
        px: 1.6,
        py: 1.1,
        borderRadius: 2,
        position: "relative",
        color: theme.palette.mode === "dark" ? "#E8ECF1" : "#0F172A",
        bgcolor:
          theme.palette.mode === "dark" ? "rgba(0,0,0,.72)" : "rgba(255,255,255,.98)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,.12)"
            : "1px solid rgba(0,0,0,.08)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,.55), 0 0 0 1px rgba(0,234,240,.15)"
            : "0 10px 24px rgba(0,0,0,.18)",
        backdropFilter: "blur(6px)",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -6,
          left: 24,
          borderWidth: 6,
          borderStyle: "solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,.72) transparent transparent transparent"
              : "rgba(255,255,255,.98) transparent transparent transparent",
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        Ventas: <b>{payload[0].value}</b>
      </Typography>
      <Typography variant="body2" sx={{ color, fontWeight: 700 }}>
        {arrow} Δ vs mes anterior: {delta > 0 ? "+" : ""}
        {delta}
      </Typography>
    </Box>
  );
};

/* =========================
   Fondo: Metaballs suaves (sin libs externas)
========================= */
const MetaballsBg = ({ ui }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(24px) saturate(120%)",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            x: [20 * i, -40 * (i + 1), 30 * (i + 1), 0],
            y: [-10 * i, 30 * (i + 1), -25 * (i + 1), 0],
          }}
          transition={{ repeat: Infinity, duration: 12 + i * 2, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            width: 220 + i * 40,
            height: 220 + i * 40,
            borderRadius: "9999px",
            top: ["10%", "60%", "30%", "70%", "20%", "50%"][i],
            left: ["5%", "70%", "40%", "15%", "80%", "55%"][i],
            background: `radial-gradient(circle at 30% 30%, ${ui.cyan}, ${ui.blue} 55%, transparent 70%), radial-gradient(circle at 70% 70%, ${ui.pink}, transparent 60%)`,
            opacity: 0.22,
          }}
        />
      ))}
    </Box>
  );
};

/* =========================
   Barra custom con Framer Motion (entrada + hover)
========================= */
const AnimatedBar = ({ x, y, width, height, fill, index, isActive }) => {
  return (
    <motion.rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={10}
      ry={10}
      fill={fill}
      initial={{ height: 0, y: y + height, opacity: 0 }}
      animate={{ height, y, opacity: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 220, damping: 24 }}
      whileHover={{ scaleY: 1.04 }}
      style={{ originY: 1 }}
      filter={`url(#${isActive ? "glowNeon" : "glowSoft"})`}
    />
  );
};

/* =========================
   Page
========================= */
const MetricasPage = () => {
  const theme = useTheme();
  const ui = getUI(theme.palette.mode);

  // Datos
  const raw = useMemo(
    () => [
      { name: "Q1", ventas: 35 },
      { name: "Q2", ventas: 44 },
      { name: "Q3", ventas: 24 },
      { name: "Q4", ventas: 34 },
    ],
    []
  );

  const data = useMemo(() => {
    return raw.map((d, i) => {
      const prev = i > 0 ? raw[i - 1].ventas : d.ventas;
      const delta = d.ventas - prev;
      return { ...d, delta };
    });
  }, [raw]);

  const total = raw.reduce((a, b) => a + b.ventas, 0);
  const max = Math.max(...raw.map((d) => d.ventas));
  const avg = Math.round(total / raw.length);

  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <Layout title={"Metricas"}>
      <Box sx={{ position: "relative" }}>
        {/* Fondo siempre activo */}
        <MetaballsBg ui={ui} />

        {/* Header con animación de glow */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} sx={{ mb: 1.5, position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ textShadow: "0 0 0 rgba(0,0,0,0)" }}
              animate={{
                textShadow: [
                  `0 1px 0 rgba(0,0,0,.25), 0 0 0 rgba(11,141,181,0)`,
                  `0 1px 0 rgba(0,0,0,.25), 0 0 18px rgba(11,141,181,.45)`,
                  `0 1px 0 rgba(0,0,0,.25), 0 0 10px rgba(255,45,117,.35)`,
                ],
              }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Gravitas One', serif",
                  fontWeight: 900,
                  fontSize: { xs: 28, sm: 34, md: 40 },
                  letterSpacing: ".04em",
                  lineHeight: 1.05,
                  textAlign: "left",
                }}
              >
                Métricas de Ventas
              </Typography>
            </motion.div>

            <Typography variant="body2" sx={{ color: ui.sub, mt: 0.5 }}>
              Le damos resultados tangibles a tu visión
            </Typography>
          </motion.div>

          {/* Botonera derecha */}
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ShareIcon />} sx={outlinedGrad(ui)}>
              Compartir
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} sx={outlinedGrad(ui)}>
              Actualizar
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />} sx={containedGrad(ui)}>
              Descargar
            </Button>
          </Stack>
        </Stack>

        {/* KPIs rápidos con fade in */}
        <Stack
          component={motion.div}
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          direction="row"
          spacing={1}
          sx={{ mb: 1.5, flexWrap: "wrap", position: "relative", zIndex: 1 }}
        >
          {[`Total: ${total}`, `Promedio: ${avg}`, `Máximo: ${max}`].map((label, i) => (
            <motion.div key={i} variants={{ hidden: { y: 6, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
              <Chip label={label} sx={{ ...outlinedGrad(ui), borderRadius: 2, py: 0.5, fontWeight: 800 }} />
            </motion.div>
          ))}
        </Stack>

        <Card
          component={motion.div}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: ui.cardShadow,
            position: "relative",
            zIndex: 1,
            background:
              theme.palette.mode === "dark"
                ? `radial-gradient(1200px 450px at -10% -20%, rgba(11,141,181,.18), transparent 60%),
                   radial-gradient(1100px 420px at 120% 120%, rgba(255,45,117,.15), transparent 60%),
                   ${ui.panel}`
                : ui.panel,
          }}
        >
          <CardContent sx={{ pt: 3, pb: 2 }}>
            {/* Chart */}
            <Box sx={{ width: "100%", height: { xs: 360, sm: 420 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 24, left: 0, bottom: 8 }}
                  onMouseMove={(e) =>
                    setActiveIdx(
                      typeof e?.activeTooltipIndex === "number"
                        ? e.activeTooltipIndex
                        : -1
                    )
                  }
                  onMouseLeave={() => setActiveIdx(-1)}
                >
                  {/* Gradientes + glow */}
                  <defs>
                    <linearGradient id="gradNeon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ui.cyan} stopOpacity={0.95} />
                      <stop offset="55%" stopColor={ui.blue} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={ui.pink} stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="gradNeonActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ui.cyan} stopOpacity={1} />
                      <stop offset="55%" stopColor={ui.blue} stopOpacity={0.98} />
                      <stop offset="100%" stopColor={ui.pink} stopOpacity={0.96} />
                    </linearGradient>
                    <filter id="glowSoft">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glowNeon">
                      <feGaussianBlur stdDeviation="5.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <Legend verticalAlign="top" align="center" wrapperStyle={{ marginBottom: 8, fontWeight: 700 }} />

                  <CartesianGrid stroke={ui.grid} strokeDasharray="4 4" />
                  <XAxis dataKey="name" tick={{ fill: ui.text }} />
                  <YAxis domain={[0, 45]} ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45]} allowDecimals={false} tick={{ fill: ui.text }} />
                  <Tooltip content={<FancyTooltip />} />

                  {/* Línea de promedio */}
                  <ReferenceLine y={avg} stroke={ui.blue} strokeDasharray="4 4" label={{ position: "right", value: `Promedio (${avg})`, fill: ui.text, fontWeight: 700 }} />

                  {/* Barras con shape custom animado */}
                  <Bar dataKey="ventas" name="Métricas de Ventas" shape={(props) => (
                    <AnimatedBar {...props} index={props.index} isActive={props.index === activeIdx} fill={props.index === activeIdx ? "url(#gradNeonActive)" : "url(#gradNeon)"} />
                  )} isAnimationActive={false}>
                    {data.map((_, i) => (
                      <Cell key={i} />
                    ))}
                    <LabelList dataKey="ventas" position="top" style={{ fill: ui.text, fontWeight: 900 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Textos inferiores */}
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: "'Gravitas One', serif",
                    fontWeight: 900,
                    fontSize: { xs: 18, sm: 20, md: 22 },
                    letterSpacing: ".02em",
                    mt: 2,
                    mb: 0.25,
                  }}
                >
                  Incremento porcentual en ventas
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Berkshire Swash', cursive",
                    fontSize: { xs: 16, sm: 17 },
                    lineHeight: 1.25,
                    color: ui.purple,
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 0 10px rgba(108,77,226,.45)"
                        : "0 0 6px rgba(108,77,226,.25)",
                    display: "inline-block",
                    mt: 0.5,
                  }}
                >
                  Progreso respecto al objetivo mensual
                </Typography>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default MetricasPage;

