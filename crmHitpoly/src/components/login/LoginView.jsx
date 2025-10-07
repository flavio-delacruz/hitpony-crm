// features/login/LoginView.jsx
import { Stage, NeonWrap, Pill, NeonDot, GlowTitle, DividerLine } from "./Login.styles";
import TapHint from "./TapHint";
import NeonButton from "./NeonButton";
import SplitText from "./SplitText";
import { fadeInUp } from "./Login.styles"
import 'animate.css';


import { Box, Typography, TextField, Grid } from "@mui/material";
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

const metaBalls = [
  { size: 250, color: "#520efdff" },
  { size: 200, color: "#000000ff" },
  { size: 180, color: "rgba(255, 45, 118, 1)" },
  { size: 220, color: "rgba(0, 255, 255, 1)" },
];


  return (
    <Stage>
      {/* Fondo MetaBalls animados */}
      {metaBalls.map((ball, i) => (
        <motion.div
          key={i}
          style={{
            width: ball.size,
            height: ball.size,
            borderRadius: "50%",
            background: ball.color,
            position: "absolute",
            filter: "blur(10px)",
            mixBlendMode: "screen",
          }}
          animate={{
            x: [0, 150 * (i % 2 ? 1 : -1), -120 * (i % 2 ? 1 : -1), 0],
            y: [0, -120, 120, 0],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      <Box 
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1.5}
        sx={{ m: 0, p: 0, top: "10%", position: "absolute" }}
      >
        <GlowTitle
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          variant="h2"
          gutterBottom={false}
          sx={{
            fontFamily: "'Fredericka the Great', serif",
            letterSpacing: ".04em",
            m: 0,
          }}
        >
          Bienvenido a Formark CRM
        </GlowTitle>

        <SplitText
          text={words[wordIndex]}
          color={colors[wordIndex]}
          fontFamily="'Montserrat', cursive"
        />
      </Box>



      <Grid container sx={{ height: "100vh" }}>
        {/* Columna derecha → Slogan */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#ECEAEF",
            textAlign: "center",
            px: 4,
          }}
        >
    <Typography
      variant="h3"
      className="animate__animated animate__backInLeft"
      sx={{
        fontFamily: "'Asimovian', sans-serif",
        fontWeight: 700,
        mb: 2,
        color: "#211E26",
      }}
    >
      Impulsa tus{" "}
      <span
        className="animate__animated animate__rubberBand animate__delay-1s"
        style={{
          color: "#0B8DB5",
          fontFamily: "'Ultra', serif",
          fontSize: "1.2em",
          display: "inline-block",
        }}
      >
        Ventas
      </span>
      , organiza tus{" "}
      <span
        className="animate__animated animate__rubberBand animate__delay-2s"
        style={{
          color: "#0B8DB5",
          fontFamily: "'Ultra', serif",
          fontSize: "1.2em",
          display: "inline-block",
        }}
      >
        Contactos
      </span>{" "}
      y haz{" "}
      <span
        className="animate__animated animate__rubberBand animate__delay-3s"
        style={{
          color: "#0B8DB5",
          fontFamily: "'Ultra', serif",
          fontSize: "1.2em",
          display: "inline-block",
        }}
      >
        crecer
      </span>{" "}
      tu negocio con nosotros.
    </Typography>


        </Grid>
        {/* Columna izquierda → Login */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NeonWrap
            className={expanded ? "expanded" : ""}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            onClick={() => setExpanded((s) => !s)}
          >
            <div className="compact">
              <Pill
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <NeonDot dotColor="#00ffff" dotSize={14} />
                INICIAR SESIÓN
                <NeonDot dotColor="#ff2d75" dotSize={14} />
              </Pill>
            </div>

            <div className="card">
              <Box sx={{ display: "grid", gap: 3, mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    sx: { borderRadius: 3, bgcolor: "#121522", color: "#fff" },
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    sx: { borderRadius: 3, bgcolor: "#121522", color: "#fff" },
                  }}
                />

                <NeonButton onClick={handleLogin}>Ingresar</NeonButton>

                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                    fontSize: 14,
                    color: "#aaa",
                  }}
                >
                  <Typography sx={{ cursor: "pointer" }}>
                    ¿Olvidaste tu contraseña?
                  </Typography>
                  <Typography sx={{ color: "#ff2d75", cursor: "pointer" }}>
                    Crear cuenta
                  </Typography>
                </Box>
              </Box>
            </div>
          </NeonWrap>
        </Grid>
      </Grid>

    </Stage>
  );
}
