import { Box } from "@mui/material";
import UserTable from "../../components/tables/userTable/userTable";
import OrdersList from "../../components/cards/ordersList/ordersList";
import Layout from "../../components/layout/layout";
import ContentCard from "../../components/cards/contentCard/contentCard";
import { useEffect, useState } from "react";
import SummaryCardsRow from "./componentes/SummaryCardsRow";
import DashboardCharts from "./componentes/Charts";
import { useProspectos } from "../../context/ProspectosContext";

const DashboardPage = () => {
  const { prospectos, loadingProspectos, errorProspectos } = useProspectos();
  const [totalProspectos, setTotalProspectos] = useState(0);
  const [totalGanados, setTotalGanados] = useState(0);
  const [totalInteresados, setTotalInteresados] = useState(0);
  const [totalAgendados, setTotalAgendados] = useState(0);

  useEffect(() => {
    if (prospectos) {
      setTotalProspectos(prospectos.length);
      const agendados = prospectos.filter(
        (p) => p.estado_contacto?.toLowerCase().trim() === "agendado"
      ).length;
      setTotalAgendados(agendados);

      const interesados = prospectos.filter(
        (p) => p.estado_contacto?.toLowerCase().trim() === "interesado"
      ).length;
      setTotalInteresados(interesados);

      const ganados = prospectos.filter(
        (p) => p.estado_contacto?.toLowerCase().trim() === "ganado"
      ).length;
      setTotalGanados(ganados);
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
      <SummaryCardsRow
        totalProspectos={totalProspectos}
        totalInteresados={totalInteresados}
        totalAgendados={totalAgendados}
        totalGanados={totalGanados}
      />

      <DashboardCharts />

      <Box
        sx={{
          width: { xs: "90vw", sm: "100%" },
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "2fr 1fr",
          },
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <ContentCard
          title="Lista de Usuarios Interesados"
          subtitle="Usuarios que se interesaron recientemente"
          gridSize={8}
        >
          <UserTable users={prospectos} />
        </ContentCard>
        <ContentCard
          title="Resumen de Leads"
          subtitle="Todos los movimientos del Lead"
          gridSize={4}
        >
          <OrdersList />
        </ContentCard>
      </Box>
    </Layout>
  );
};

export default DashboardPage;