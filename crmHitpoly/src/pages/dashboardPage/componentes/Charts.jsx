import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ChartCard from "../../../components/cards/chartCard/chartCard";
import { useProspectos } from "../../../context/ProspectosContext";

const DashboardCharts = () => {
  const { prospectos } = useProspectos();
  const [prospectosPorMes, setProspectosPorMes] = useState({
    meses: [],
    totalPorMes: [],
    ganadosPorMes: [],
    perdidosPorMes: [],
  });
  
  const [porcentajes, setPorcentajes] = useState({
    total: "Cargando...",
    ganados: "Cargando...",
    perdidos: "Cargando...",
  });

  useEffect(() => {
    if (!prospectos || prospectos.length === 0) {
      // Manejar el caso de que no haya prospectos o aún se estén cargando
      setProspectosPorMes({
        meses: [],
        totalPorMes: [],
        ganadosPorMes: [],
        perdidosPorMes: [],
      });
      setPorcentajes({
        total: "No hay datos",
        ganados: "No hay datos",
        perdidos: "No hay datos",
      });
      return;
    }

    const hoy = new Date();
    const mesesLabels = [];

    const totalPorMes = Array(4).fill(0);
    const ganadosPorMes = Array(4).fill(0);
    const perdidosPorMes = Array(4).fill(0);

    for (let i = 3; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.toLocaleString("es-ES", { month: "short" });
      const label = `${mes} ${fecha.getFullYear()}`;
      mesesLabels.push(label);
    }

    prospectos.forEach((p) => {
      const fecha = new Date(p.created_at);
      const estado = p.estado_contacto?.toLowerCase().trim();
      const mesDiferencia = hoy.getMonth() - fecha.getMonth() + 12 * (hoy.getFullYear() - fecha.getFullYear());

      if (mesDiferencia >= 0 && mesDiferencia < 4) {
        const index = 3 - mesDiferencia;
        totalPorMes[index]++;
        if (estado === "ganado") {
          ganadosPorMes[index]++;
        }
        if (estado === "perdido") {
          perdidosPorMes[index]++;
        }
      }
    });

    setProspectosPorMes({
      meses: mesesLabels,
      totalPorMes,
      ganadosPorMes,
      perdidosPorMes,
    });

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? "+100% respecto al mes pasado" : "0% respecto al mes pasado";
      }
      const percentage = ((current - previous) / previous) * 100;
      const sign = percentage >= 0 ? "+" : "";
      return `${sign}${percentage.toFixed(1)}% respecto al mes pasado`;
    };

    setPorcentajes({
      total: calculatePercentageChange(totalPorMes[3], totalPorMes[2]),
      ganados: calculatePercentageChange(ganadosPorMes[3], ganadosPorMes[2]),
      perdidos: calculatePercentageChange(perdidosPorMes[3], perdidosPorMes[2]),
    });
    
  }, [prospectos]);

  const { meses, totalPorMes, ganadosPorMes, perdidosPorMes } = prospectosPorMes;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(3, 1fr)",
        },
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      <ChartCard
        series={[{ data: totalPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Todos los prospectos"
        title="Desde los últimos 4 meses"
        subtitle={porcentajes.total}
      />

      <ChartCard
        series={[{ data: ganadosPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Prospectos Ganados"
        title="Desde los últimos 4 meses"
        subtitle={porcentajes.ganados}
      />

      <ChartCard
        series={[{ data: perdidosPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Prospectos Perdidos"
        title="Desde los últimos 4 meses"
        subtitle={porcentajes.perdidos}
      />
    </Box>
  );
};

export default DashboardCharts;