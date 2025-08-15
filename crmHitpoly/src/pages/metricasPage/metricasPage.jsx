import { Card, CardContent, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Layout from "../../components/layout/layout";
import ChartCard from "../../components/cards/chartCard/chartCard";

const MetricasPage = () => {
  const data = [
    { name: "Enero", users: 400 },
    { name: "Febrero", users: 600 },
    { name: "Marzo", users: 800 },
    { name: "Abril", users: 1200 },
    { name: "Mayo", users: 1500 },
    { name: "Junio", users: 1800 },
    { name: "Julio", users: 2200 },
  ];

  return (
    <Layout title={"Metricas"}>
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
    </Layout>
  );
};

export default MetricasPage;
