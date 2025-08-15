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
  const data = {
    labels: xAxis[0].data, 
    datasets: [
      {
        label: titleChart,
        data: series[0].data,
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
        text: titleChart,
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
