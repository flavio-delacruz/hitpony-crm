import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

import UserTable from "../../components/tables/userTable/userTable";
import OrdersList from "../../components/cards/ordersList/ordersList";
import Layout from "../../components/layout/layout";
import ContentCard from "../../components/cards/contentCard/contentCard";
import SummaryCardsRow from "./componentes/SummaryCardsRow";
import DashboardCharts from "./componentes/Charts";
import { useProspectos } from "../../context/ProspectosContext";

/* =========================
   Paleta / helpers
========================= */
const getUI = () => ({
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  pink: "#FF2D75",
  text: "#E8ECF1",
  panel: "#0b0f14",
});

/* =========================
   Fondo metaballs suave
========================= */
const MetaballsBg = () => {
  const ui = getUI();
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
        zIndex: 0,
        overflow: "hidden",
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
            top: ["10%", "60%", "30%", "70%", "20%", "50%"][i],
            left: ["5%", "70%", "40%", "15%", "80%", "55%"][i],
            borderRadius: "9999px",
            background: `radial-gradient(circle at 30% 30%, ${ui.cyan}, ${ui.blue} 55%, transparent 70%),
                         radial-gradient(circle at 70% 70%, ${ui.pink}, transparent 60%)`,
            opacity: 0.22,
          }}
        />
      ))}
    </Box>
  );
};

/* =========================
   Card neón para secciones
========================= */
const SectionCard = ({ children }) => (
  <Box
    component={motion.div}
    initial={{ y: 14, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 200, damping: 22 }}
    sx={{
      position: "relative",
      borderRadius: 14,
      overflow: "hidden",
      background: "#0b0f14",
      boxShadow: "0 18px 50px rgba(0,0,0,.55)",
    }}
  >
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        p: "1px",
        background: "linear-gradient(120deg,#00EAF0,#0B8DB5 40%,#FF2D75 85%,#00EAF0)",
        backgroundSize: "200% 200%",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* shimmer */}
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
            "linear-gradient(120deg, transparent 0, rgba(255,255,255,.08) 20%, transparent 40%)",
        }}
      />
    </Box>

    {children}
  </Box>
);

/* =========================
   Página
========================= */
const DashboardPage = () => {
  const { prospectos, loadingProspectos, errorProspectos } = useProspectos();
  const [totalProspectos, setTotalProspectos] = useState(0);
  const [totalGanados, setTotalGanados] = useState(0);
  const [totalInteresados, setTotalInteresados] = useState(0);
  const [totalAgendados, setTotalAgendados] = useState(0);

  const ui = getUI();

  useEffect(() => {
    if (prospectos) {
      setTotalProspectos(prospectos.length);
      setTotalAgendados(
        prospectos.filter((p) => p.estado_contacto?.toLowerCase().trim() === "agendado").length
      );
      setTotalInteresados(
        prospectos.filter((p) => p.estado_contacto?.toLowerCase().trim() === "interesado").length
      );
      setTotalGanados(
        prospectos.filter((p) => p.estado_contacto?.toLowerCase().trim() === "ganado").length
      );
    }
  }, [prospectos]);

  if (loadingProspectos) {
    return (
      <Layout title="Inicio">
        <p>Cargando prospectos...</p>
      </Layout>
    );
  }

  if (errorProspectos) {
    return (
      <Layout title="Inicio">
        <p>Error: {errorProspectos}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Inicio">
      <Box sx={{ position: "relative", background: ui.panel }}>
        <MetaballsBg />

        {/* Título con glow y efecto “stagger” por letra */}
        <Stack sx={{ mb: 2, position: "relative", zIndex: 1 }}>
          <Typography
            component="div"
            sx={{
              fontFamily: "'Gravitas One', serif",
              fontWeight: 900,
              letterSpacing: ".04em",
              color: ui.text,
              fontSize: { xs: 36, sm: 44 },
              lineHeight: 1.05,
            }}
          >
            {"Dashboard".split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 240, damping: 18 }}
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,.25), 0 0 18px rgba(11,141,181,.45), 0 0 12px rgba(255,45,117,.35)",
                  display: "inline-block",
                }}
              >
                {ch}
              </motion.span>
            ))}
          </Typography>
        </Stack>

        {/* KPIs */}
        <SectionCard>
          <Box sx={{ p: { xs: 1, sm: 1.5 }, position: "relative", zIndex: 1 }}>
            <SummaryCardsRow
              totalProspectos={totalProspectos}
              totalInteresados={totalInteresados}
              totalAgendados={totalAgendados}
              totalGanados={totalGanados}
            />
          </Box>
        </SectionCard>

        {/* Gráficas */}
        <Box sx={{ mt: 2 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
              <DashboardCharts />
            </Box>
          </SectionCard>
        </Box>

        {/* Tabla + Resumen */}
        <Box
          sx={{
            width: { xs: "90vw", sm: "100%" },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "2fr 1fr" },
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
            mt: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionCard>
            <ContentCard
              title="Lista de Usuarios Interesados"
              subtitle="Usuarios que se interesaron recientemente"
              gridSize={8}
            >
              <UserTable users={prospectos} />
            </ContentCard>
          </SectionCard>

          <SectionCard>
            <ContentCard
              title="Resumen de Leads"
              subtitle="Todos los movimientos del Lead"
              gridSize={4}
            >
              <OrdersList />
            </ContentCard>
          </SectionCard>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
