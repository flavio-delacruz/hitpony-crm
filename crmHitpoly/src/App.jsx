import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/dashboardPage/dashboardPage";
//import InfoContacto from "./components/infoContacto/infoContacto";
//import InfoAfiliados from "./components/infoDelAfiliado/infoAfiliado";
import UserListPage from "./pages/userListPage/userListPage";
import AffiliateProfilePage from "./pages/affiliateProfilePage/affiliateProfilePage";
//import PaginaCrm from "./components/paginaCrm/paginaCrm";
import MetricasPage from "./pages/metricasPage/metricasPage";
import CrmPage from "./pages/crmPage/crmPage";
import ContactPage from "./pages/contactPage/ContactPage";

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
          element={<UserListPage />}
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
          path="/crm"
          element={<CrmPage />}
        />
        <Route
          path="/pagina-de-contacto"
          element={<ContactPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
