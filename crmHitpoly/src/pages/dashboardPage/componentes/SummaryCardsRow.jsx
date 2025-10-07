import { Grid, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PALETA } from "../../../theme/paleta";

const Item = ({ label, value }) => (
  <Card
    component={motion.div}
    initial={{ y: 8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 200, damping: 18 }}
    sx={{
      p: 2,
      background: PALETA.white,                     // ← BLANCO
      border: `1px solid ${PALETA.border}`,
    }}
  >
    <Typography variant="body2" sx={{ color: PALETA.text, opacity: .9 }}>{label}</Typography>
    <Typography
      variant="h4"
      sx={{
        mt: .5,
        color: PALETA.sky,                           // número en Azul Cielo
        textShadow: `0 0 12px ${PALETA.glowSky}`,    // brillo azul cielo
        fontWeight: 800,
      }}
    >
      {value}
    </Typography>
  </Card>
);

const SummaryCardsRow = ({
  totalProspectos = 0,
  totalInteresados = 0,
  totalAgendados = 0,
  totalGanados = 0,
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={3}><Item label="Total de Prospectos" value={totalProspectos} /></Grid>
    <Grid item xs={12} md={3}><Item label="Próximos a comprar" value={totalInteresados} /></Grid>
    <Grid item xs={12} md={3}><Item label="Agendados" value={totalAgendados} /></Grid>
    <Grid item xs={12} md={3}><Item label="Clientes Ganados" value={totalGanados} /></Grid>
  </Grid>
);

export default SummaryCardsRow;
