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

const MetricasPage = () => {
  // Datos de ejemplo para el crecimiento del usuario
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
    <Layout>
      <Card
        sx={{
          maxWidth: "100%",
          margin: "auto",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
          >
            Crecimiento de Usuarios
          </Typography>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MetricasPage;
