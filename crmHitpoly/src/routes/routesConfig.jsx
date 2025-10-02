//* Importaciones de componentes, pages y context
import Login from "../components/login/login";
import Dashboard from "../pages/dashboardPage/dashboardPage";
import UserListPage from "../pages/userListPage/userListPage";
import AffiliateProfilePage from "../pages/affiliateProfilePage/affiliateProfilePage";
import MetricasPage from "../pages/metricasPage/metricasPage";
import CrmPage from "../pages/crmPage/crmPage";
import ContactPage from "../pages/contactPage/ContactPage";
import RegistroClienteForm from "../components/forms/clientesPotenciales/layoutFormPublic";
import ProspectosTracker from "../pages/tracker/ProspectosTracker";
import ThankYouPage from "../components/forms/paginaDeGracias";
import FetchAndStoreProspects from "../components/correos/enviados/EnviarCorreo";
import Listas from "../pages/listas/ListasUser";
import ListaDetalles from "../pages/listas/components/ListaDetalles";
import EnviarCorreo from "../components/correos/enviados/EnviarCorreo";
import EnviarCorreoAdmin from "../components/correos/enviados/EnviarCorreoAdmin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import GestorDeAsignaciones from "../pages/equipo/GestorDeAsignaciones";
import MisAsignacionesContainer from "../pages/equipo/MisAsignacionesContainer";
import GestorClientes from "../pages/admin/pages/GestorClientes";


//! Configuracion centralizada de rutas y cada objeto tiene: path, el componente a renderizar (element) y el tipo de protección (public, protected, role)

export const routesConfig = [

  //? Rutas públicas
  { path: "/", element: <Login />, type: "public" }, //TODO:  -> Página de login
  { path: "/registros/:formName", element: <RegistroClienteForm />, type: "public" }, //TODO:  -> Formulario público de registro de clientes
  { path: "/gracias-por-confiar-en-hitpoly", element: <ThankYouPage />, type: "public" }, //TODO:  -> Página de agradecimiento

  //? Rutas para administradores -> protegidas con roles
  { path: "/admin-dashboard", element: <AdminDashboard />, type: "role", roles: ["admin"] }, //TODO:  -> Solo admin accede
  { path: "/gestor-de-asignaciones", element: <GestorDeAsignaciones />, type: "role", roles: ["admin", "cliente"] }, //TODO:  ->  Admin y cliente acceden
  { path: "/gestor-de-clientes", element: <GestorClientes />, type: "role", roles: ["admin", "cliente"] }, //TODO:  ->  Admin y cliente acceden
  { path: "/equipo", element: <MisAsignacionesContainer />, type: "role", roles: ["admin", "cliente", "closer", "setter"] }, //TODO:  ->  Acceso para varios roles

  //? Rutas generales -> protegidas solo por login
  { path: "/dashboard", element: <Dashboard />, type: "protected" }, //TODO:  ->  Dashboard general
  { path: "/perfil", element: <AffiliateProfilePage />, type: "protected" }, //TODO:  ->  Perfil de usuario
  { path: "/pagina-de-contacto/:prospectId", element: <ContactPage />, type: "protected" }, //TODO:  ->  Detalle de contacto por prospecto
  { path: "/prueva", element: <FetchAndStoreProspects />, type: "protected" }, //TODO:  ->  (Ojo: typo en 'prueva') Componente de prueba
  { path: "/todas-las-listas", element: <Listas />, type: "protected" }, //TODO:  ->  Listado de listas
  { path: "/listas/:nombreLista", element: <ListaDetalles />, type: "protected" }, //TODO:  ->  Detalles de una lista específica
  { path: "/contactos", element: <UserListPage />, type: "protected" }, //TODO:  ->  Listado de contactos
  { path: "/enviar-correo-empresa", element: <EnviarCorreoAdmin />, type: "protected" }, //TODO:  ->  Enviar correos como admin
  { path: "/metricas", element: <MetricasPage />, type: "protected" }, //TODO:  ->  Métricas y reportes

  //? Rutas relacionadas con CRM y seguimiento -> protegidas
  { path: "/crm", element: <CrmPage />, type: "protected" }, //TODO:  ->  Página CRM
  { path: "/tracker", element: <ProspectosTracker />, type: "protected" }, //TODO:  ->  Seguimiento de prospectos
  { path: "/enviar-correo", element: <EnviarCorreo />, type: "protected" }, //TODO:  ->  Enviar correo normal
];
