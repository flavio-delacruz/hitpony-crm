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
    const fetchAllProspects = async () => {
      if (!user?.id) return;

      try {
        let finalProspects = [];
        const { id, id_tipo } = user;

        // Lógica para traer prospectos de setters si el usuario es closer (id_tipo === 3)
        if (id_tipo === "3" || id_tipo === 3) {
          const asignacionesResponse = await fetch(
            "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accion: "get" }),
            }
          );
          const asignacionesData = await asignacionesResponse.json();

          let setterIds = [];
          if (asignacionesData.data && asignacionesData.data.length > 0) {
            const asignacionDelCloser = asignacionesData.data.find(
              (asignacion) => Number(asignacion.id_closer) === Number(id)
            );
            if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
              try {
                const parsedSetters = JSON.parse(
                  asignacionDelCloser.setters_ids
                );
                if (Array.isArray(parsedSetters)) {
                  setterIds = parsedSetters;
                }
              } catch (e) {
                console.error("Error parsing setters_ids:", e);
              }
            }
          }
          const promises = setterIds.map((setterId) =>
            fetch(
              "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
              }
            ).then((res) => res.json())
          );
          const allProspectsFromSetters = await Promise.all(promises);
          finalProspects = allProspectsFromSetters.flatMap(
            (data) => data.resultado || []
          );
        }

        // Traer los prospectos del usuario actual
        const userProspectsResponse = await fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ funcion: "getProspectos", id: id }),
          }
        );
        const userProspectsData = await userProspectsResponse.json();
        const prospectsFromUser = userProspectsData.resultado || [];

        // Combinar todos los prospectos
        finalProspects =
          id_tipo === "3" || id_tipo === 3
            ? [...finalProspects, ...prospectsFromUser]
            : prospectsFromUser;

        const nuevosProspectosFormatted = finalProspects.map((item) => ({
          id: item.id,
          ...item,
        }));

        setProspectosData(nuevosProspectosFormatted);
        setTotalProspectos(nuevosProspectosFormatted.length);

        // Calcular los totales de cada categoría
        const agendados = nuevosProspectosFormatted.filter(
          (p) => p.estado_contacto?.toLowerCase().trim() === "agendado"
        ).length;
        setTotalAgendados(agendados);

        const interesados = nuevosProspectosFormatted.filter(
          (p) => p.estado_contacto?.toLowerCase().trim() === "interesado"
        ).length;
        setTotalInteresados(interesados);

        const ganados = nuevosProspectosFormatted.filter(
          (p) => p.estado_contacto?.toLowerCase().trim() === "ganado"
        ).length;
        setTotalGanados(ganados);

      } catch (error) {
        setTotalProspectos(0);
        setTotalGanados(0);
        setTotalInteresados(0);
        setTotalAgendados(0);
        setProspectosData([]);
      }
    };

    fetchAllProspects();
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
          title="Lista de Usuarios Interesados"
          subtitle="Usuarios que se interesaron recientemente"
          gridSize={8}
        >
          <UserTable users={prospectosData} />
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