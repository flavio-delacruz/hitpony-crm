import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { brand } from "../../theme";

const REST_OFFSET_VH = -8;
const EXPANDED_W = 460;
const EXPANDED_H = 620; // ↑ más alto para que no corte el botón

/* ====== Escena con fondo a pantalla completa ====== */
const Stage = styled(Box)({
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  position: "relative",
  background: `
    radial-gradient(ellipse at 80% 80%, rgba(11,141,181,.18), transparent 45%),
    radial-gradient(ellipse at 0% 0%, rgba(108,77,226,.16), transparent 45%),
    rgba(15,16,22,.72)
  `,
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: `url("/Hitpoly.jpeg") center/cover fixed no-repeat`,
    zIndex: -1,
  },
});

/* ====== Card/Btn con estilo neón ====== */
const NeonWrap = styled(Box)({
  position: "relative",
  width: 320,
  height: 96,
  borderRadius: 20,
  background: brand.card,
  boxShadow:
    "0 12px 30px rgba(0,0,0,.45), inset 0 -2px 0 rgba(255,255,255,.04)",
  transform: `translateY(${REST_OFFSET_VH}vh)`,
  willChange: "transform, width, height",
  transition: `
    transform .55s cubic-bezier(.2,.8,.2,1),
    width .55s cubic-bezier(.2,.8,.2,1),
    height .55s cubic-bezier(.2,.8,.2,1),
    border-radius .55s, box-shadow .35s
  `,
  overflow: "hidden",

  "::before, ::after": {
    content: '""',
    position: "absolute",
    width: "64%",
    height: 8,
    filter: "blur(8px)",
    transition: "opacity .35s",
  },
  "::before": {
    left: -12,
    top: 22,
    background: `linear-gradient(90deg,${brand.blue},#00ffff00 80%)`,
  },
  "::after": {
    right: -12,
    bottom: 22,
    background: `linear-gradient(270deg,${brand.pink},#ff2d7500 80%)`,
  },

  "& .compact": {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    letterSpacing: ".18em",
    fontWeight: 700,
    userSelect: "none",
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity .3s, transform .3s",
  },

  "& .card": {
    position: "absolute",
    inset: 0,
    padding: "28px 28px 40px", // ← padding bottom extra
    display: "grid",
    gridTemplateRows: "auto auto 1fr auto",
    gap: 14,
    color: brand.text,
    opacity: 0,
    transform: "translateY(10px) scale(.98)",
    transition: "opacity .35s .15s, transform .35s .15s",
  },

  "&.expanded, &:hover": {
    width: EXPANDED_W,
    height: EXPANDED_H,
    borderRadius: 24,
    transform: "translateY(0)",
    boxShadow:
      "0 16px 50px rgba(0,0,0,.55), inset 0 -2px 0 rgba(255,255,255,.04), 0 0 30px rgba(0,234,255,.15), 0 0 30px rgba(255,45,117,.15)",
  },
  "&.expanded .compact, &:hover .compact": {
    opacity: 0,
    transform: "translateY(-6px)",
    pointerEvents: "none",
  },
  "&.expanded .card, &:hover .card": {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },

  /* Fallback cuando la pantalla es bajita: nunca cortar el botón */
  "@media (max-height: 700px)": {
    "&.expanded, &:hover": {
      height: "82vh",
    },
    "& .card": {
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    },
  },
});

const Pill = styled(Box)({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 26px",
  borderRadius: 16,
  background: "linear-gradient(180deg,#1a1e2a,#151826)",
  boxShadow:
    "inset 0 0 0 1px rgba(255,255,255,.06), 0 6px 20px rgba(0,0,0,.35)",
  textTransform: "uppercase",
  fontSize: 14,
  whiteSpace: "nowrap",
});

const NeonDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "dotColor" && prop !== "dotSize",
})(({ dotColor, dotSize = 12 }) => ({
  display: "inline-block",
  width: dotSize,
  height: dotSize,
  borderRadius: "50%",
  background: dotColor,
  boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}`,
}));

const GlowTitle = styled(Typography)({
  fontWeight: 800,
  letterSpacing: ".08em",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#ffffff",
  textShadow: `
    0 0 8px rgba(255,255,255,.35),
    0 0 22px ${brand.blue}55,
    0 0 22px ${brand.purple}40
  `,
});

const DividerLine = styled("div")({
  height: 1,
  background:
    "linear-gradient(90deg,transparent,#2b3247 20%,#2b3247 80%,transparent)",
  marginTop: 6,
  marginBottom: 10,
});

export default function Login() {
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
  const colors = [brand.purple, "#FBBC05", brand.blue];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 4000);
    return () => clearInterval(t);
  }, []);

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
    <Stage>
      <NeonWrap
        className={expanded ? "expanded" : ""}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onClick={() => setExpanded((s) => !s)}
      >
        {/* Compacto con manita en esquina superior izquierda */}
        <div className="compact">
          <Pill className={showHint ? "glow" : ""}>
            {showHint && (
              <div className="tap-hint-inset" aria-hidden>
                <div className="pulse p1" />
                <div className="pulse p2" />
                <div className="hand">👆</div>
              </div>
            )}
            <NeonDot dotColor={brand.cyan} dotSize={12} />
            INICIAR SESIÓN
            <NeonDot dotColor={brand.pink} dotSize={12} />
          </Pill>
        </div>

        {/* Tarjeta expandida */}
        <div className="card">
          <GlowTitle
            variant="h6"
            sx={{ fontFamily: "'Gravitas One', serif", letterSpacing: ".04em" }}
          >
            Bienvenido a Formark CRM
          </GlowTitle>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: colors[wordIndex],
              fontFamily: "'Berkshire Swash', cursive",
              fontWeight: 400,
              letterSpacing: ".02em",
              transition: "color .5s ease",
              animation: "fadeIn 1s ease",
            }}
          >
            {words[wordIndex]}
          </Typography>

          <DividerLine />

          <Box sx={{ display: "grid", gap: 14, mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              label="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{ sx: { borderRadius: 3, bgcolor: "#121522", color: brand.text } }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{ sx: { borderRadius: 3, bgcolor: "#121522", color: brand.text } }}
            />

            <Button
              fullWidth
              size="large"
              onClick={handleLogin}
              sx={{
                mt: 0.5,
                mb: 0.5,              // ← margen inferior para separarlo del borde
                py: 1.2,
                fontWeight: 800,
                letterSpacing: ".03em",
                borderRadius: 999,
                position: "relative",  // asegúrate que no quede bajo ningún pseudo-elemento
                zIndex: 1,
                background: `linear-gradient(90deg,${brand.cyan} 0%, ${brand.blue} 40%, ${brand.pink} 100%)`,
                color: "#0a0c13",
                boxShadow: `0 12px 35px ${brand.blue}40, 0 10px 35px ${brand.pink}33`,
                "&:hover": {
                  filter: "brightness(1.05)",
                  boxShadow: `0 16px 45px ${brand.blue}66, 0 12px 45px ${brand.pink}55`,
                },
              }}
            >
              Ingresar
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, fontSize: 14, color: brand.text2 }}>
              <Typography sx={{ cursor: "pointer" }}>¿Olvidaste tu contraseña?</Typography>
              <Typography sx={{ color: brand.pink, cursor: "pointer" }}>Crear cuenta</Typography>
            </Box>
          </Box>
        </div>

        {/* Estilos/animaciones + fuentes */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Gravitas+One&display=swap');

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px) }
            100% { opacity: 1; transform: translateY(0) }
          }

          .glow {
            box-shadow:
              inset 0 0 0 1px rgba(255,255,255,.06),
              0 0 24px ${brand.blue}66,
              0 0 28px ${brand.purple}55;
            animation: glowblink 1.8s ease-in-out 1;
          }
          @keyframes glowblink {
            0% { filter: brightness(1); }
            50% { filter: brightness(1.15); }
            100% { filter: brightness(1); }
          }

          .tap-hint-inset{
            position:absolute;
            top: -10px; left: -10px;
            width: 70px; height: 70px;
            pointer-events:none;
            z-index: 10;
            animation: hintFade 2.6s ease forwards;
          }
          .tap-hint-inset .hand{
            position:absolute;
            left: 14px; top: 12px;
            font-size: 22px;
            transform-origin: bottom right;
            filter: drop-shadow(0 0 8px ${brand.blue}99);
            animation: tap 1.2s ease-in-out .15s 2 both;
          }
          .tap-hint-inset .pulse{
            position:absolute;
            left: 16px; top: 16px;
            width: 24px; height: 24px;
            border-radius: 999px;
            border: 2px solid ${brand.cyan}CC;
            box-shadow: 0 0 14px ${brand.cyan}88, 0 0 14px ${brand.pink}55 inset;
            animation: pulse 1.2s ease-out .1s 2 both;
          }
          .tap-hint-inset .p2{
            border-color: ${brand.pink}CC;
            animation-delay: .35s;
          }

          @keyframes hintFade {
            0% { opacity: 0; } 12% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; }
          }
          @keyframes pulse {
            from { transform: scale(.6); opacity:.95; }
            to   { transform: scale(1.7); opacity:0; }
          }
          @keyframes tap {
            0%,100% { transform: translate(0,0) scale(1); }
            40% { transform: translate(2px,2px) scale(.96); }
            60% { transform: translate(0,0) scale(1.03); }
          }
        `}</style>
      </NeonWrap>
    </Stage>
  );
}

