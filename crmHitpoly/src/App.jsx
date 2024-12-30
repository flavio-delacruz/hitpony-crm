import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/dashboardPage/dashboardPage";
import InfoContacto from "./components/infoContacto/infoContacto";
import InfoAfiliados from "./components/infoDelAfiliado/infoAfiliado";
import ListaDeUsuarios from "./pages/listaDeUsuarios/listaDeUsuarios";
import AffiliateProfilePage from "./pages/affiliateProfilePage/affiliateProfilePage";
import PaginaCrm from "./components/paginaCrm/paginaCrm";
import MetricasPage from "./pages/metricasPage/metricasPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/usuarios"
          element={<ListaDeUsuarios />}
        />
        <Route
          path="/perfil"
          element={<AffiliateProfilePage />}
        />
        <Route
          path="/metricas"
          element={<MetricasPage />}
        />
        <Route
          path="/pagina"
          element={<PaginaCrm />}
        />
      </Routes>
    </Router>
  );
}

export default App;
