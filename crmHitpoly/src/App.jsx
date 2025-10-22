import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProspectosProvider } from "./context/ProspectosContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ProspectosProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ProspectosProvider>
    </AuthProvider>
  );
}

export default App;