import { Box } from "@mui/material";
import UserTable from "../../components/tables/userTable/userTable";
import OrdersList from "../../components/cards/ordersList/ordersList";
import Layout from "../../components/layout/layout";
import ContentCard from "../../components/cards/contentCard/contentCard";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import SummaryCardsRow from "./componentes/SummaryCardsRow";
import DashboardCharts from "./componentes/Charts";

const DashboardPage = () => {
  const { user } = useAuth();
  const [totalProspectos, setTotalProspectos] = useState(null);
  const [totalGanados, setTotalGanados] = useState(null);
  const [prospectosData, setProspectosData] = useState([]);
  const [totalInteresados, setTotalInteresados] = useState(null);
  const [totalAgendados, setTotalAgendados] = useState(null);

  useEffect(() => {
    const fetchProspectos = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              funcion: "getProspectos",
              id: user.id,
            }),
          }
        );

        const data = await response.json();
        console.log("Respuesta de API:", data);

        if (Array.isArray(data.resultado)) {
          setProspectosData(data.resultado);
          setTotalProspectos(data.resultado.length);

          const agendados = data.resultado.filter(
            (p) => p.estado_contacto?.toLowerCase().trim() === "agendado"
          ).length;
          setTotalAgendados(agendados);

          const interesados = data.resultado.filter(
            (p) => p.estado_contacto?.toLowerCase().trim() === "interesado"
          ).length;
          setTotalInteresados(interesados);

          const ganados = data.resultado.filter(
            (p) => p.estado_contacto?.toLowerCase().trim() === "ganado"
          ).length;
          setTotalGanados(ganados);
        } else {
          setTotalProspectos(0);
          setTotalGanados(0);
          setProspectosData([]);
        }
      } catch (error) {
        console.error("Error al obtener prospectos:", error);
        setTotalProspectos(0);
        setTotalGanados(0);
        setProspectosData([]);
      }
    };

    fetchProspectos();
  }, [user]);

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
          title="Lista de Usuarios"
          subtitle="30 usuarios que han interactuado recientemente"
          gridSize={8}
        >
          <UserTable users={prospectosData} />
        </ContentCard>
        <ContentCard
          title="Resumen de Leads"
          subtitle="Cantidad de leads capturados hoy"
          gridSize={4}
        >
          <OrdersList />
        </ContentCard>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
