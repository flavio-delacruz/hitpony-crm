// features/login/LoginContainer.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import LoginView from "./LoginView";
import { useWordCycle } from "./useWordCycle";

export default function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const words = [
    "Le damos resultados tangibles a tu visión",
    "Revolucionamos tu camino hacia el éxito",
    "Creamos un futuro de oportunidades",
  ];
  const colors = ["#2D1638", "#2D1638", "#2D1638  "];
  const wordIndex = useWordCycle(words);

  useEffect(() => {
    const showT = setTimeout(() => setShowHint(true), 450);
    const hideT = setTimeout(() => setShowHint(false), 2600);
    return () => { clearTimeout(showT); clearTimeout(hideT); };
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("https://apiweb.hitpoly.com/ajax/usuarioMasterController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "login", email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        login(data.user);
        navigate("/dashboard");
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Correo o contraseña incorrectos" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error del servidor", text: "Hubo un problema al conectar con el servidor." });
    }
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleLogin();

  return (
    <LoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleKeyDown={handleKeyDown}
      expanded={expanded}
      setExpanded={setExpanded}
      showHint={showHint}
      words={words}
      wordIndex={wordIndex}
      colors={colors}
      error={error}
    />
  );
}
