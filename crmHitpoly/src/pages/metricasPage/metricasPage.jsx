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

/* =========================
   Paleta + helpers
========================= */
const getUI = (mode) => ({
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  pink: "#FF2D75",
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
   Tooltip con delta ↑/↓
========================= */
const FancyTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload;
  const delta = p?.delta ?? 0;
  const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "•";
  const color = delta > 0 ? "#22C55E" : delta < 0 ? "#FF4D6D" : "#94A3B8";

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,.06)" : "#fff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,.12)"
            : "1px solid rgba(0,0,0,.08)",
        boxShadow: "0 10px 24px rgba(0,0,0,.25)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        Ventas: <b>{payload[0].value}</b>
      </Typography>
      <Typography variant="body2" sx={{ color, fontWeight: 700 }}>
        {arrow} Δ vs mes anterior: {delta > 0 ? "+" : ""}{delta}
      </Typography>
    </Box>
  );
};

/* =========================
   Página
========================= */
const MetricasPage = () => {
  const theme = useTheme();
  const ui = getUI(theme.palette.mode);

  // Valores exactos que mostraste (Q1=35, Q2=44, Q3=24, Q4=34)
  const raw = useMemo(
    () => [
      { name: "Q1", ventas: 35 },
      { name: "Q2", ventas: 44 },
      { name: "Q3", ventas: 24 },
      { name: "Q4", ventas: 34 },
    ],
    []
  );

  // Enriquecemos con delta, promedio, etc.
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
      {/* Botonera superior (píldoras) */}
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
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

      {/* KPIs rápidos (chips con gradiente) */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
        <Chip
          label={`Total: ${total}`}
          sx={{
            ...outlinedGrad(ui),
            borderRadius: 2,
            py: 0.5,
            fontWeight: 800,
          }}
        />
        <Chip
          label={`Promedio: ${avg}`}
          sx={{ ...outlinedGrad(ui), borderRadius: 2, py: 0.5, fontWeight: 800 }}
        />
        <Chip
          label={`Máximo: ${max}`}
          sx={{ ...outlinedGrad(ui), borderRadius: 2, py: 0.5, fontWeight: 800 }}
        />
      </Stack>

      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: ui.cardShadow,
          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(1200px 450px at -10% -20%, rgba(11,141,181,.18), transparent 60%),
                 radial-gradient(1100px 420px at 120% 120%, rgba(255,45,117,.15), transparent 60%),
                 ${ui.panel}`
              : ui.panel,
        }}
      >
        <CardContent sx={{ pt: 3, pb: 2 }}>
          {/* Título superior */}
          <Typography
  variant="h6"
  sx={{
    fontFamily: "'Gravitas One', serif",
    fontWeight: 900,
    fontSize: { xs: 24, sm: 30, md: 36 },   // ↑ más grande
    letterSpacing: ".04em",
    lineHeight: 1.05,
    textAlign: "left",
    mb: 1,
    textShadow: `
      0 1px 0 rgba(0,0,0,.25),
      0 0 18px rgba(11,141,181,.25)
    `,
  }}
>
  Métricas de Ventas
</Typography>

          <Box sx={{ width: "100%", height: 440 }}>
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
                  {/* normal */}
                  <linearGradient id="gradNeon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ui.cyan} stopOpacity={0.95} />
                    <stop offset="55%" stopColor={ui.blue} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={ui.pink} stopOpacity={0.85} />
                  </linearGradient>
                  {/* activa/hover */}
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

                {/* Leyenda centrada (como tu screenshot) */}
                <Legend
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ marginBottom: 8, fontWeight: 700 }}
                />

                <CartesianGrid stroke={ui.grid} strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: ui.text }} />
                <YAxis
  domain={[0, 45]}
  ticks={[0,5,10,15,20,25,30,35,40,45]}
  allowDecimals={false}
  tick={{ fill: ui.text }}
/>
                <Tooltip content={<FancyTooltip />} />

                {/* Línea de promedio */}
                <ReferenceLine
                  y={avg}
                  stroke={ui.blue}
                  strokeDasharray="4 4"
                  label={{
                    position: "right",
                    value: `Promedio (${avg})`,
                    fill: ui.text,
                    fontWeight: 700,
                  }}
                />

                <Bar
                  dataKey="ventas"
                  name="Métricas de Ventas"
                  radius={[10, 10, 0, 0]}
                  isAnimationActive
                  animationBegin={160}
                  animationDuration={900}
                >
                  {data.map((d, i) => (
                    <Cell
                      key={i}
                      fill={i === activeIdx ? "url(#gradNeonActive)" : "url(#gradNeon)"}
                      filter={`url(#${i === activeIdx ? "glowNeon" : "glowSoft"})`}
                    />
                  ))}
                  {/* Etiquetas de valor sobre cada barra */}
                  <LabelList
                    dataKey="ventas"
                    position="top"
                    style={{
                      fill: ui.text,
                      fontWeight: 900,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Textos inferiores como tu imagen */}
         <Typography
  variant="subtitle1"
  sx={{
    fontFamily: "'Gravitas One', serif",
    fontWeight: 900,
    fontSize: { xs: 18, sm: 20, md: 22 },   // ↑ un poco más grande
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
    fontSize: { xs: 16, sm: 17 },         // más legible
    lineHeight: 1.25,
    color: ui.purple,                      // combina con tus neones
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
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MetricasPage;
