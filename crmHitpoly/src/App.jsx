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
import GestorDeAsignaciones from "./pages/admin/pages/GestorDeAsignaciones";

// Función auxiliar para mapear id_tipo a un rol legible
const getRoleFromIdTipo = (id_tipo) => {
  switch (id_tipo) {
    case 1:
      return "admin";
    case 2:
      return "setter";
    case 3:
      return "closer";
    case 4:
      return "cliente";
    default:
      return "undefined";
  }
};

// Componente de ruta protegida general (solo verifica si está autenticado)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Componente de ruta protegida que verifica el rol
const ProtectedRouteWithRole = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const userRole = getRoleFromIdTipo(user?.id_tipo);

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Verifica si el usuario existe y si su rol (mapeado de id_tipo) está en la lista de roles requeridos
  if (user && requiredRoles.includes(userRole)) {
    return children;
  }

  // Si no cumple los requisitos, lo redirige a un dashboard por defecto.
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
                <ProtectedRouteWithRole
                  requiredRoles={["admin",]}
                >
                  <AdminDashboard />
                </ProtectedRouteWithRole>
              }
            />
            <Route
              path="/gestor-de-asignaciones"
              element={
                <ProtectedRoute requiredRoles={["admin",]}>
                  <GestorDeAsignaciones />
                </ProtectedRoute>
              }
            />

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
