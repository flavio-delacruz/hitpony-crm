
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleFromIdTipo } from "../constants/roles"; 

//! Ruta protegida simple (solo revisa si está autenticado)
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

//! Ruta protegida con roles
export const ProtectedRouteWithRole = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const userRole = getRoleFromIdTipo(user?.id_tipo);

  if (!isAuthenticated) return <Navigate to="/" />;
  if (user && requiredRoles.includes(userRole)) return children;

  return <Navigate to="/dashboard" />;
};
