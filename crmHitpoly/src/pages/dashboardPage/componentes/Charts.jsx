import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ChartCard from "../../../components/cards/chartCard/chartCard";
import { useAuth } from "../../../context/AuthContext";

const DashboardCharts = () => {
  const { user } = useAuth();
  const [prospectosPorMes, setProspectosPorMes] = useState({
    meses: [],
    totalPorMes: [],
    ganadosPorMes: [],
    perdidosPorMes: [],
  });

  useEffect(() => {
    const fetchAllProspectsAndProcess = async () => {
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
                const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
                if (Array.isArray(parsedSetters)) {
                  setterIds = parsedSetters;
                }
              } catch (e) {
                console.error("Error parsing setters_ids:", e);
              }
            }
          }
          const promises = setterIds.map((setterId) =>
            fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
            }).then((res) => res.json())
          );
          const allProspectsFromSetters = await Promise.all(promises);
          finalProspects = allProspectsFromSetters.flatMap((data) => data.resultado || []);
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

        const resultado = finalProspects;
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

        resultado.forEach((p) => {
          const fecha = new Date(p.created_at);
          const estado = p.estado_contacto?.toLowerCase().trim();
          const mesDiferencia = hoy.getMonth() - fecha.getMonth() + 12 * (hoy.getFullYear() - fecha.getFullYear());

          if (mesDiferencia >= 0 && mesDiferencia < 4) {
            const index = 3 - mesDiferencia;
            totalPorMes[index]++;
            if (estado === "ganado") ganadosPorMes[index]++;
            if (estado === "perdido") perdidosPorMes[index]++;
          }
        });

        setProspectosPorMes({
          meses: mesesLabels,
          totalPorMes,
          ganadosPorMes,
          perdidosPorMes,
        });
      } catch (error) {
        setProspectosPorMes({
          meses: [],
          totalPorMes: [],
          ganadosPorMes: [],
          perdidosPorMes: [],
        });
      }
    };

    fetchAllProspectsAndProcess();
  }, [user]);

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
      {/* Total de prospectos por mes */}
      <ChartCard
        series={[{ data: totalPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Todos los prospectos"
        title="Desde los últimos 4 meses"
        subtitle="%+ respecto al mes pasado"
      />

      {/* Ganados por mes */}
      <ChartCard
        series={[{ data: ganadosPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Prospectos Ganados"
        title="Desde los últimos 4 meses"
        subtitle="%+ respecto al mes pasado"
      />

      {/* Perdidos por mes */}
      <ChartCard
        series={[{ data: perdidosPorMes }]}
        xAxis={[{ data: meses, scaleType: "band" }]}
        titleChart="Prospectos Perdidos"
        title="Desde los últimos 4 meses"
        subtitle="%+ respecto al mes pasado"
      />
    </Box>
  );
};

export default DashboardCharts;