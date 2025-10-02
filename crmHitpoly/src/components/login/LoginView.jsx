// features/login/LoginView.jsx
import { Stage, NeonWrap, Pill, NeonDot, GlowTitle, DividerLine } from "./Login.styles";
import TapHint from "./TapHint";
import NeonButton from "./NeonButton";
import SplitText from "./SplitText";

import { Box, Typography, TextField } from "@mui/material";
import { motion } from "framer-motion";

export default function LoginView({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  handleKeyDown,
  expanded,
  setExpanded,
  showHint, 
  words,
  wordIndex,
  colors,
  error,
}) { // divide en palabras

  return (
    <Stage>
      <GlowTitle variant="h1" sx={{ fontFamily: "'Gravitas One', serif", letterSpacing: ".04em" }}>
        Bienvenido a Formark CRM
      </GlowTitle>

      <SplitText
          text={words[wordIndex]}
          color={colors[wordIndex]}
          fontFamily="'Berkshire Swash', cursive"
      />


      <NeonWrap
        className={expanded ? "expanded" : ""}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onClick={() => setExpanded((s) => !s)}
      >
        <div className="compact">
          <Pill
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], // se mueve de izq a der y vuelve
            }}
            transition={{
              duration: 6, // tiempo en segundos
              repeat: Infinity, // animación infinita
              ease: "linear", // movimiento constante
            }}
          >
          <NeonDot dotColor="#00ffff" dotSize={14} />
          INICIAR SESIÓN
          <NeonDot dotColor="#ff2d75" dotSize={14} />
          </Pill>
        </div>

        <div className="card">
          

            
            <Typography
            variant="body2"
            sx={{
                textAlign: "center",
                fontFamily: "'Berkshire Swash', cursive",
                fontWeight: 400,
                letterSpacing: ".02em",
            }}
            >
            
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
              InputProps={{ sx: { borderRadius: 3, bgcolor: "#121522", color: "#fff" } }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{ sx: { borderRadius: 3, bgcolor: "#121522", color: "#fff" } }}
            />

            <NeonButton onClick={handleLogin}>Ingresar</NeonButton>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, fontSize: 14, color: "#aaa" }}>
              <Typography sx={{ cursor: "pointer" }}>¿Olvidaste tu contraseña?</Typography>
              <Typography sx={{ color: "#ff2d75", cursor: "pointer" }}>Crear cuenta</Typography>
            </Box>
          </Box>
        </div>
      </NeonWrap>
    </Stage>
  );
}
