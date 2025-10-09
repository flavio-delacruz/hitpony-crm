// ...imports iguales

const DashboardPage = () => {
  // ...estado y lógica iguales

  const ui = {
    panel: "#FFFFFF",
    text:  "#211E26",
    glowCyan: "rgba(11,141,181,.35)",
    glowViolet: "rgba(108,77,226,.25)",
    border: "rgba(33,30,38,.15)",
  };

  // ...loading & error

  return (
    <Layout title="Inicio">
      {/* Fuerza fondo BLANCO en toda la vista */}
      <Box sx={{ position: "relative", bgcolor: "#FFFFFF" }}>
        {/* ...resto de tu contenido tal como lo tenías */}
      </Box>
    </Layout>
  );
};

export default DashboardPage;

