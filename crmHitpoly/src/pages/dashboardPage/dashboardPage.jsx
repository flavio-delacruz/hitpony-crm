import { Grid } from "@mui/material";
import UserTable from "../../components/tables/userTable/userTable";
import OrdersList from "../../components/cards/ordersList/ordersList";
import Layout from "../../components/layout/layout";
import InfoCard from "../../components/cards/infoCard/infoCard";
import ChartCard from "../../components/cards/chartCard/chartCard";
import ContentCard from "../../components/cards/contentCard/contentCard";

const DashboardPage = () => {
  return (
    <Layout>
      {/* Cards Row 1 */}
      <Grid
        container
        spacing={2}
        mb={4}
      >
        <InfoCard
          title="Dinero del dia"
          amount="$53k"
          percentage="+55% respecto a la semana pasada"
          percentageColor="textSecondary"
        />
        <InfoCard
          title="Usuarios del Día"
          amount="2,300"
          percentage="+3% respecto al mes pasado"
        />
        <InfoCard
          title="Nuevos Clientes"
          amount="3,462"
          percentage="-2% respecto a ayer"
        />
        <InfoCard
          title="Ventas"
          amount="$103,430"
          percentage="+5% respecto a ayer"
        />
      </Grid>
      {/* Cards Row 2 */}
      <Grid
        container
        spacing={2}
        mb={4}
      >
        <ChartCard
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          titleChart="Reporte de Usuarios"
          title="Número total de usuarios registrados"
          subtitle="Resumen de los usuarios activos/inactivos más recientes"
        />
        <ChartCard
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          titleChart="Estado de Leads"
          title="Cantidad de leads distribuidos..."
          subtitle=" +15% leads gestionados hoy"
        />
        <ChartCard
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          titleChart="Métricas de Ventas"
          title="Incremento porcentual en ventas"
          subtitle="Progreso respecto al objetivo mensual"
        />
      </Grid>

      {/* Cards Row 3 */}
      <Grid
        container
        spacing={2}
      >
        <ContentCard
          title="Lista de Usuarios"
          subtitle="30 usuarios que han interactuado recientemente"
          gridSize={8}
        >
          <UserTable />
        </ContentCard>
        <ContentCard
          title="Resumen de Leads"
          subtitle="Cantidad de leads capturados hoy"
          gridSize={4}
        >
          <OrdersList />
        </ContentCard>
      </Grid>
    </Layout>
  );
};

export default DashboardPage;
