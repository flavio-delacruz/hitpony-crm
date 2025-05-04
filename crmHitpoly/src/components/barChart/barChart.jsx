import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ titleChart, series, xAxis }) => {
  // Configuración de los datos del gráfico
  const data = {
    labels: xAxis[0].data, // Usamos las labels que se pasan por props
    datasets: [
      {
        label: titleChart, // Usamos el título como etiqueta
        data: series[0].data, // Usamos los datos que se pasan por props
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: titleChart, // Título dinámico
      },
    },
  };

  return (
    <Card sx={{ boxShadow: "none" }}>
      <CardContent>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: "1.3rem" } }}
          variant="h5"
          component="div"
          gutterBottom
        >
          {titleChart}
        </Typography>
        <Bar
          data={data}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default BarChart;
