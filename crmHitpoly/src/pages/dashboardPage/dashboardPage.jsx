import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

import UserTable from "../../components/tables/userTable/userTable";
import OrdersList from "../../components/cards/ordersList/ordersList";
import Layout from "../../components/layout/layout";
import ContentCard from "../../components/cards/contentCard/contentCard";
import SummaryCardsRow from "./componentes/SummaryCardsRow";
import DashboardCharts from "./componentes/Charts";
import { useProspectos } from "../../context/ProspectosContext";

// Fuente Montserrat 900 para títulos
import "@fontsource/montserrat/900.css";

/* =========================
   Paleta / helpers (modo claro)
========================= */
const getUI = () => ({
  sky: "#00C2FF",
  cyan: "#0B8DB5",
  violet: "#6C4DE2",
  text: "#211E26",
  panel: "#FFFFFF",
  border: "rgba(33,30,38,.15)",
  glowCyan: "rgba(11,141,181,.35)",
  glowViolet: "rgba(108,77,226,.25)",
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
        filter: "blur(22px) saturate(105%)",
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
            background: `radial-gradient(circle at 30% 30%, ${ui.sky}22, ${ui.cyan}22 55%, transparent 70%),
                         radial-gradient(circle at 70% 70%, ${ui.violet}22, transparent 60%)`,
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
      ))}
    </Box>
  );
};

/* =========================
   Card con fondo degradado y halo animado
========================= */
const SectionCard = ({ children }) => {
  const ui = getUI();
  const GRADIENT_BG =
    "linear-gradient(145deg, rgba(125,211,252,0.92) 0%, rgba(167,139,250,0.92) 100%)";

  return (
    <Box
      component={motion.div}
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      sx={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        backgroundImage: GRADIENT_BG,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent !important",
        border: "1px solid rgba(255,255,255,0.35)",
        boxShadow:
          "0 14px 36px rgba(96,165,250,0.26), 0 4px 10px rgba(167,139,250,0.18)",
        color: "#fff",
      }}
    >
      <Box
        component={motion.div}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          p: "1px",
          background: `linear-gradient(120deg, ${ui.sky}, ${ui.cyan} 35%, ${ui.violet} 80%, ${ui.sky})`,
          backgroundSize: "220% 220%",
          opacity: 0.4,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          position: "relative",
          zIndex: 1,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/* =========================
   Página principal
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

  if (loadingProspectos)
    return (
      <Layout title="Inicio">
        <p>Cargando prospectos...</p>
      </Layout>
    );

  if (errorProspectos)
    return (
      <Layout title="Inicio">
        <p>Error: {errorProspectos}</p>
      </Layout>
    );

  return (
    <Layout title="Inicio">
      <Box sx={{ position: "relative", background: ui.panel }}>
        <MetaballsBg />

        {/* Título principal */}
        <Stack sx={{ mb: 2, position: "relative", zIndex: 1, alignItems: "center" }}>
          <Typography
            component="div"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              letterSpacing: ".02em",
              lineHeight: 1.05,
              fontSize: { xs: 40, sm: 56 },
              textAlign: "center",
              background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 0 10px rgba(108,77,226,.20), 0 0 12px rgba(11,141,181,.18)",
            }}
          >
            Dashboard
          </Typography>
        </Stack>

        {/* KPIs */}
        <SectionCard>
          <SummaryCardsRow
            totalProspectos={totalProspectos}
            totalInteresados={totalInteresados}
            totalAgendados={totalAgendados}
            totalGanados={totalGanados}
          />
        </SectionCard>

        {/* Gráficas */}
        <Box sx={{ mt: 2 }}>
          <SectionCard>
            <DashboardCharts />
          </SectionCard>
        </Box>

        {/* Tabla + Resumen */}
        <Box
          sx={{
            width: { xs: "90vw", sm: "100%" },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "2fr 1fr" },
            gap: 2,
            mb: 2,
            mt: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionCard>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                mb: 1,
                textAlign: "center",
              }}
            >
              Lista de Usuarios Interesados
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
            >
              Usuarios que se interesaron recientemente
            </Typography>
            <ContentCard>
              <UserTable users={prospectos} />
            </ContentCard>
          </SectionCard>

          <SectionCard>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                mb: 1,
                textAlign: "center",
              }}
            >
              Resumen de Leads
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
            >
              Todos los movimientos del Lead
            </Typography>
            <ContentCard>
              <OrdersList />
            </ContentCard>
          </SectionCard>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
