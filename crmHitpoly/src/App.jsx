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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to="/" />;
  }

  // Si está autenticado, muestra el contenido de la ruta protegida
  return children;
};

function App() {
  return (
    <AuthProvider>
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
            path="/pagina-de-contacto" 
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
