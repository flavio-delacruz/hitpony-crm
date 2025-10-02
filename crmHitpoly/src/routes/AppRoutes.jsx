import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, ProtectedRouteWithRole } from "./ProtectedRoute";
import { routesConfig } from "./routesConfig.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map(({ path, element, type, roles }) => {

        //? Caso 1: Ruta pública "no necesita autenticación"
        if (type === "public") {
          return <Route key={path} path={path} element={element} />;
        }

        //? Caso 2: Ruta protegida (requiere estar logueado, pero no importa el rol)
        if (type === "protected") {
          return (
            <Route
              key={path}
              path={path}
              //! ProtectedRoute valida si el usuario está autenticado
              //! Si lo está → renderiza el componente
              //! Si no → redirige a "/"
              element={<ProtectedRoute>{element}</ProtectedRoute>}
            />
          );
        }

        //? Caso 3: Ruta protegida por rol (requiere login + rol específico)
        if (type === "role") {
          return (
            <Route
              key={path}
              path={path}
              //! ProtectedRouteWithRole valida:
              //! 1. Que esté logueado
              //! 2. Que el rol del usuario esté en la lista "roles"
              //! ✔ Si cumple → renderiza el componente
              //! ✔ Si no cumple → redirige a "/dashboard"
              element={
                <ProtectedRouteWithRole requiredRoles={roles}>
                  {element}
                </ProtectedRouteWithRole>
              }
            />
          );
        }

        //? Si no se reconoce el tipo de ruta, no renderiza nada
        return null;
      })}
    </Routes>
  );
};

export default AppRoutes;
