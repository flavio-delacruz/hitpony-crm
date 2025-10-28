import { Grid, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PALETA } from "../../../theme/paleta";

/**
 * Degradado tipo azul–lila con un efecto glass suave.
 */
const GRADIENT_BACKGROUND =
  "linear-gradient(145deg, rgba(125, 211, 252, 0.9) 0%, rgba(167, 139, 250, 0.9) 100%)";

const Item = ({ label, value }) => (
  <Card
    component={motion.div}
    initial={{ y: 8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.04 }}
    transition={{ type: "spring", stiffness: 200, damping: 18 }}
    sx={{
      p: 2,
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.3)",
      background: GRADIENT_BACKGROUND,
      backdropFilter: "blur(12px)",
      boxShadow:
        "0 8px 24px rgba(96, 165, 250, 0.3), 0 2px 6px rgba(167, 139, 250, 0.2)",
      fontFamily: "Montserrat, sans-serif",
      color: "#000",
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: "#fff",
        opacity: 0.95,
        fontWeight: "bold",
        fontFamily: "Montserrat, sans-serif",
        textShadow: "0 0 4px rgba(0,0,0,0.25)",
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="h4"
      sx={{
        mt: 0.5,
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Montserrat, sans-serif",
        textShadow: "0 0 8px rgba(0,0,0,0.4)",
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
    <Grid item xs={12} md={3}>
      <Item label="Total de Prospectos" value={totalProspectos} />
    </Grid>
    <Grid item xs={12} md={3}>
      <Item label="Próximos a comprar" value={totalInteresados} />
    </Grid>
    <Grid item xs={12} md={3}>
      <Item label="Agendados" value={totalAgendados} />
    </Grid>
    <Grid item xs={12} md={3}>
      <Item label="Clientes Ganados" value={totalGanados} />
    </Grid>
  </Grid>
);

export default SummaryCardsRow;

