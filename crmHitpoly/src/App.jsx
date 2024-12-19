import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import InfoContacto from './components/infoContacto/infoContacto';
import InfoAfiliados from './components/infoDelAfiliado/infoAfiliado';
import ListaDeUsuarios from './components/listaDeUsuarios/listaDeUsuarios';
import PaginaCrm from './components/paginaCrm/paginaCrm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/metricas" element={<Dashboard />} />
        <Route path="/contacto" element={<InfoContacto />} />
        <Route path="/afiliados" element={<InfoAfiliados />} />
        <Route path="/usuarios" element={<ListaDeUsuarios />} />
        <Route path="/pagina" element={<PaginaCrm />} />
      </Routes>
    </Router>
  );
}

export default App;
