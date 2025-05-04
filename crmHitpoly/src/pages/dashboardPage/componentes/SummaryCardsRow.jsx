// components/cards/summaryCardsRow/SummaryCardsRow.js
import { Box } from "@mui/material";
import InfoCard from "../../../components/cards/infoCard/infoCard";

const SummaryCardsRow = ({
  totalProspectos,
  totalInteresados,
  totalAgendados,
  totalGanados,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
        },
        gap: { xs: "10px", sm: "20px" },
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      <InfoCard
        title="Total de Prospectos"
        amount={
          totalProspectos !== null
            ? totalProspectos.toLocaleString()
            : "Cargando..."
        }
        percentage="+55% respecto a la semana pasada"
        percentageColor="textSecondary"
      />

      <InfoCard
        title="Próximos a comprar"
        amount={
          totalInteresados !== null
            ? totalInteresados.toLocaleString()
            : "Cargando..."
        }
        percentage="+8% esta semana"
        percentageColor="textSecondary"
      />

      <InfoCard
        title="Agendados"
        amount={
          totalAgendados !== null
            ? totalAgendados.toLocaleString()
            : "Cargando..."
        }
        percentage="+5% respecto a ayer"
        percentageColor="textSecondary"
      />

      <InfoCard
        title="Clientes Ganados"
        amount={
          totalGanados !== null
            ? totalGanados.toLocaleString()
            : "Cargando..."
        }
        percentage="+12% respecto al mes pasado"
      />
    </Box>
  );
};

export default SummaryCardsRow;
