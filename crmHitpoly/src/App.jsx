// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/dashboardPage/dashboardPage";
import UserListPage from "./pages/userListPage/userListPage";
import AffiliateProfilePage from "./pages/affiliateProfilePage/affiliateProfilePage";
import MetricasPage from "./pages/metricasPage/metricasPage";
import CrmPage from "./pages/crmPage/crmPage";
import ContactPage from "./pages/contactPage/ContactPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProspectosProvider } from "./context/ProspectosContext"; // Importa el proveedor de prospectos
import RegistroClienteForm from "./components/forms/clientesPotenciales/layoutFormPublic";
import ProspectosTracker from "./pages/tracker/ProspectosTracker";
import ThankYouPage from "./components/forms/paginaDeGracias";
import FetchAndStoreProspects from "./components/correos/enviados/EnviarCorreo";
import Listas from "./pages/listas/ListasUser";
import ListaDetalles from "./pages/listas/components/ListaDetalles";
import EnviarCorreo from "./components/correos/enviados/EnviarCorreo";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <ProspectosProvider>
        {" "}
        {/* Envuelve los componentes que necesitan los prospectos */}
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <UserListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <AffiliateProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/metricas"
              element={
                <ProtectedRoute>
                  <MetricasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute>
                  <CrmPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <ProspectosTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pagina-de-contacto/:prospectId"
              element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="formulario-de-contacto-cliente"
              element={<RegistroClienteForm />}
            />
            <Route
              path="/registros/:formName"
              element={<RegistroClienteForm />}
            />
            <Route
              path="/gracias-por-confiar-en-hitpoly"
              element={<ThankYouPage />}
            />
            <Route path="/prueva" element={<FetchAndStoreProspects />} />
            <Route
              path="/listas/:nombreLista"
              element={
                <ProtectedRoute>
                  <ListaDetalles />
                </ProtectedRoute>
              }
            />
            {/* Ruta dinámica */}
            <Route
              path="/todas-las-listas"
              element={
                <ProtectedRoute>
                  <Listas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enviar-correo"
              element={
                <ProtectedRoute>
                  <EnviarCorreo />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ProspectosProvider>
    </AuthProvider>
  );
}

export default App;
