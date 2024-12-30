import { Grid } from "@mui/material";
import UserTable from "../../components/userTable/userTable";
import OrdersList from "../../components/ordersList/ordersList";
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
          title="Today's Money"
          amount="$53k"
          percentage="+55% than last week"
          percentageColor="textSecondary"
        />
        <InfoCard
          title="Today's Users"
          amount="2,300"
          percentage="+3% than last month"
        />
        <InfoCard
          title="New Clients"
          amount="3,462"
          percentage="-2% than yesterday"
        />
        <InfoCard
          title="Sales"
          amount="$103,430"
          percentage="+5% than yesterday"
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
          title="Website Views"
          subtitle="Last Campaign Performance"
        />
        <ChartCard
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          title="Daily Sales"
          subtitle=" (+15%) increase in today sales."
        />
        <ChartCard
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          title="Completed Tasks"
          subtitle="Last Campaign Performance"
        />
      </Grid>

      {/* Cards Row 3 */}
      <Grid
        container
        spacing={2}
      >
        <ContentCard
          title="Projects"
          subtitle="30 done this month"
          gridSize={8}
        >
          <UserTable />
        </ContentCard>
        <ContentCard
          title="Orders Overview"
          subtitle="24 new orders"
          gridSize={4}
        >
          <OrdersList />
        </ContentCard>
      </Grid>
    </Layout>
  );
};

export default DashboardPage;
