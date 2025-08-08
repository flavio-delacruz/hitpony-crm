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
import { ProspectosProvider } from "./context/ProspectosContext";
import RegistroClienteForm from "./components/forms/clientesPotenciales/layoutFormPublic";
import ProspectosTracker from "./pages/tracker/ProspectosTracker";
import ThankYouPage from "./components/forms/paginaDeGracias";
import FetchAndStoreProspects from "./components/correos/enviados/EnviarCorreo";
import Listas from "./pages/listas/ListasUser";
import ListaDetalles from "./pages/listas/components/ListaDetalles";
import EnviarCorreo from "./components/correos/enviados/EnviarCorreo";
import EnviarCorreoAdmin from "./components/correos/enviados/EnviarCorreoAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Componente de ruta protegida general (solo verifica si está autenticado)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Componente de ruta protegida que verifica el rol
const ProtectedRouteWithRole = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Verifica si el usuario existe y si su rol está en la lista de roles requeridos
  if (user && requiredRoles.includes(user.rol)) {
    return children;
  }

  // Si no cumple los requisitos, lo redirige a un dashboard por defecto.
  // Es importante tener un dashboard al que cualquier usuario logueado pueda acceder.
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <ProspectosProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Rutas públicas que no requieren autenticación */}
            <Route
              path="/registros/:formName"
              element={<RegistroClienteForm />}
            />
            <Route
              path="/gracias-por-confiar-en-hitpoly"
              element={<ThankYouPage />}
            />

            {/* Solo para administradores */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRouteWithRole requiredRoles={["administrador", "setter", "closer"]}>
                  <AdminDashboard />
                </ProtectedRouteWithRole>
              }
            />

            {/* Rutas protegidas que requieren autenticación, pero no un rol específico */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
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
              path="/pagina-de-contacto/:prospectId"
              element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prueva"
              element={
                <ProtectedRoute>
                  <FetchAndStoreProspects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todas-las-listas"
              element={
                <ProtectedRoute>
                  <Listas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listas/:nombreLista"
              element={
                <ProtectedRoute>
                  <ListaDetalles />
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
              path="/enviar-correo-empresa"
              element={
                <ProtectedRoute>
                  <EnviarCorreoAdmin />
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

            {/* Solo para setters */}
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
