import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/dashboardPage/dashboardPage";
import InfoContacto from "./components/infoContacto/infoContacto";
import InfoAfiliados from "./components/infoDelAfiliado/infoAfiliado";
import ListaDeUsuarios from "./pages/listaDeUsuarios/listaDeUsuarios";
import PaginaCrm from "./components/paginaCrm/paginaCrm";

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
          path="/afiliados"
          element={<InfoAfiliados />}
        />
        <Route
          path="/metricas"
          element={<ListaDeUsuarios />}
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
