import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import ContactoCard from "../../../components/cards/ContactoCard";
import { PALETA } from "../../../theme/paleta";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

/* =========================
   UI helpers (modo claro)
========================= */
const UI = {
  sky: PALETA.sky,           // #00C2FF
  cyan: PALETA.cyan,         // #0B8DB5
  purple: PALETA.purple,     // #6C4DE2
  text: PALETA.text,         // #211E26
  white: PALETA.white,       // #FFFFFF
  border: PALETA.border,     // rgba(11,141,181,.25)
  borderSoft: PALETA.borderSoft || "rgba(11,141,181,.18)",
  shadow: PALETA.shadow || "0 8px 30px rgba(33,30,38,.08)",
};

const GRADIENT_BG =
  "linear-gradient(145deg, rgba(125,211,252,0.95) 0%, rgba(167,139,250,0.95) 100%)";

/* =========================
   Fondo con Metaballs sutiles
========================= */
const MetaballsBg = () => (
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
      filter: "blur(22px) saturate(110%)",
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
          background: `radial-gradient(circle at 30% 30%, ${UI.sky}22, ${UI.cyan}22 55%, transparent 70%),
                       radial-gradient(circle at 70% 70%, ${UI.purple}22, transparent 60%)`,
          opacity: 0.35,
          mixBlendMode: "multiply",
        }}
      />
    ))}
  </Box>
);

/* =========================
   Título Montserrat 900 con degradado + animación por letra (centrado)
========================= */
const NeonTitle = ({ text }) => (
  <Typography
    component="div"
    sx={{
      fontFamily:
        "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 900,
      letterSpacing: ".02em",
      lineHeight: 1.05,
      fontSize: { xs: 32, sm: 40 },
      position: "relative",
      zIndex: 1,
      textAlign: "center", // ← centrado
    }}
  >
    {text.split("").map((ch, i) =>
      ch === " " ? (
        <span key={`sp-${i}`} style={{ display: "inline-block", width: "0.35em" }}>&nbsp;</span>
      ) : (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, type: "spring", stiffness: 260, damping: 18 }}
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 10px rgba(108,77,226,.20), 0 0 12px rgba(11,141,181,.18)",
          }}
        >
          {ch}
        </motion.span>
      )
    )}
  </Typography>
);

/* =========================
   Contenedor con fondo degradado + borde degradado animado + shimmer
========================= */
const NeonCard = ({ children, sx }) => (
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
      // FONDO DEGRADADO (como pediste)
      backgroundImage: GRADIENT_BG,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundColor: "transparent !important",
      color: "#fff",
      ...sx,
    }}
  >
    {/* Borde gradiente animado */}
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        p: "1px",
        borderRadius: 18,
        background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 35%, ${UI.purple} 80%, ${UI.sky})`,
        backgroundSize: "220% 220%",
        opacity: 0.5,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* shimmer sutil */}
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
            "linear-gradient(120deg, transparent 0, rgba(255,255,255,.16) 20%, transparent 40%)",
        }}
      />
    </Box>

    {children}
  </Box>
);

/* =========================
   Search pill sticky con borde gradiente
========================= */
const SearchBar = ({ value, onChange }) => (
  <Paper
    elevation={0}
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      p: 1,
      mb: 3,
      background: "transparent",
      borderRadius: 999,
    }}
  >
    <Box
      sx={{
        p: "1px",
        borderRadius: 999,
        background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 35%, ${UI.purple} 80%, ${UI.sky})`,
        backgroundSize: "220% 220%",
        animation: "edgeFlow 8s linear infinite",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar miembro del equipo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          sx: {
            borderRadius: 999,
            background: UI.white,
            px: 1.5,
            "& input::placeholder": {
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "rgba(33,30,38,.55)",
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: UI.borderSoft },
            "&.Mui-focused": {
              boxShadow:
                "0 0 0 2px rgba(0,194,255,.20), 0 10px 24px rgba(0,0,0,.08)",
            },
          },
        }}
      />
    </Box>
    <style>{`
      @keyframes edgeFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </Paper>
);

/* =========================
   Sección con etiqueta/chip (Montserrat + negrita + centrado)
========================= */
const SectionHeader = ({ label }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
    <Chip
      label={
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800, // NEGRITA
            letterSpacing: ".02em",
          }}
        >
          {label}
        </Typography>
      }
      sx={{
        background:
          "linear-gradient(90deg, rgba(0,194,255,.15), rgba(108,77,226,.15))",
        border: `1px solid ${UI.borderSoft}`,
        borderRadius: 2,
        px: 1,
      }}
    />
  </Box>
);

/* =========================
   Componente principal
========================= */
const MisAsignacionesSetter = ({
  user,
  contactos,
  asignaciones,
  asignacionesCloserSetter,
  getContacto,
  handleOpenCorreo,
  searchInput,
  setSearchInput,
}) => {
  const [closerAsignado, setCloserAsignado] = useState(null);
  const [clienteAsignado, setClienteAsignado] = useState(null);

  useEffect(() => {
    let foundCloser = null;
    if (asignacionesCloserSetter && Array.isArray(asignacionesCloserSetter)) {
      for (const asignacion of asignacionesCloserSetter) {
        if (asignacion.setters_ids) {
          try {
            const setterIdsFromApi = JSON.parse(asignacion.setters_ids);
            if (
              setterIdsFromApi.map((id) => id.toString()).includes(user.id.toString())
            ) {
              foundCloser = getContacto(asignacion.id_closer);
              break;
            }
          } catch (e) {
            console.error("Error al parsear setters_ids:", e);
          }
        }
      }
    }
    setCloserAsignado(foundCloser);

    if (foundCloser && asignaciones && Array.isArray(asignaciones)) {
      const clienteFound = asignaciones.find((cliAsig) =>
        cliAsig.closers_ids.some(
          (closerId) => closerId.toString() === foundCloser.id.toString()
        )
      );
      if (clienteFound) {
        const clienteInfo = getContacto(clienteFound.cliente_id);
        setClienteAsignado(clienteInfo);
      } else {
        setClienteAsignado(null);
      }
    } else {
      setClienteAsignado(null);
    }
  }, [asignaciones, asignacionesCloserSetter, user.id, getContacto]);

  const closersFiltrados = closerAsignado
    ? [closerAsignado].filter((c) =>
        (c.nombre && c.nombre.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.apellido && c.apellido.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.correo && c.correo.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : [];

  const clienteFiltrado = clienteAsignado
    ? [clienteAsignado].filter((c) =>
        (c.nombre && c.nombre.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.apellido && c.apellido.toLowerCase().includes(searchInput.toLowerCase())) ||
        (c.correo && c.correo.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : [];

  return (
    <Box sx={{ position: "relative", p: { xs: 2, sm: 3 }, background: UI.white }}>
      {/* Fondo metaballs */}
      <MetaballsBg />

      {/* Título */}
      <Box sx={{ mb: 2, position: "relative", zIndex: 1 }}>
        <NeonTitle text="Equipo" />
      </Box>

      {/* Buscador */}
      <SearchBar value={searchInput} onChange={setSearchInput} />

      {/* Cliente Asignado */}
      <SectionHeader label="Cliente Asignado" />
      <Grid container spacing={2} sx={{ mb: 2, position: "relative", zIndex: 1 }}>
        {clienteFiltrado.length > 0 ? (
          <Grid item xs={12} sm={6} md={4}>
            <NeonCard>
              {/* Contenido */}
              <Box sx={{ borderRadius: 18, overflow: "hidden" }}>
                <ContactoCard
                  contacto={clienteFiltrado[0]}
                  tipo="Cliente"
                  onOpenCorreo={handleOpenCorreo}
                />
              </Box>
            </NeonCard>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography
              sx={{
                color: "rgba(33,30,38,.85)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700, // NEGRITA
                textAlign: "center",
              }}
            >
              No tienes un cliente asignado.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Closer Asignado */}
      <SectionHeader label="Closer Asignado" />
      <Grid container spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        {closersFiltrados.length > 0 ? (
          <Grid item xs={12} sm={6} md={4}>
            <NeonCard>
              <Box sx={{ borderRadius: 18, overflow: "hidden" }}>
                <ContactoCard
                  contacto={closersFiltrados[0]}
                  tipo="Closer"
                  onOpenCorreo={handleOpenCorreo}
                />
              </Box>
            </NeonCard>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography
              sx={{
                color: "rgba(33,30,38,.85)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700, // NEGRITA
                textAlign: "center",
              }}
            >
              No tienes un closer asignado.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MisAsignacionesSetter;

