
// features/login/LoginView.jsx
import { Stage, NeonWrap, Pill, NeonDot, GlowTitle } from "./Login.styles";
import TapHint from "./TapHint";
import NeonButton from "./NeonButton";
import SplitText from "./SplitText";
import { fadeInUp } from "./Login.styles";
import LoginForm from "./LoginForm";
import "animate.css";

import { Box, Typography, TextField, Grid, Button  } from "@mui/material";
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
}) {


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
        sx={{
          m: 0,
          p: 0,
          position: "relative",
          textAlign: "center",
          px: { xs: 2, sm: 3, md: 3 },
          my: { xs: 0, sm: 0, md: 0 },
        }}
      >
        <GlowTitle
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          variant="h2"
          gutterBottom={false}
          sx={{
            mt: { xs: 4, sm: 3, md: 4 },
            fontFamily: "'Fredericka the Great', serif",
            letterSpacing: ".04em",
            m: 0,
            fontSize: { xs: "1.8rem", sm: "2.3rem", md: "4.6rem" },
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

      <Grid
        container
        sx={{
          px: { xs: 2, sm: 4, md: 4 },
          py: { xs: 2, sm: 4, md: 0 },
          mb: { xs: 8, sm: 8, md: 0 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Columna derecha → Slogan */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            m: 0,
            p: 0,
            order: { xs: 1, md: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#ECEAEF",
            textAlign: "center",
            px: { xs: 1, sm: 2, md: 6 },
            marginY: { xs: 2, sm: 0, md: 0 },

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
              fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2.5rem" },
              lineHeight: 1.4,
            }}
          >
            Impulsa tus{" "}
            <span
              className="animate__animated animate__rubberBand animate__delay-1s"
              style={{
                color: "#0B8DB5",
                fontFamily: "'Ultra', serif",
                fontSize: "1.5em",
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
                fontSize: "1.5em",
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
                fontSize: "1.5em",
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
            order: { xs: 2, md: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 0, sm: 0, md: 0 },
          }}
        >
          <LoginForm handleLogin={handleLogin}/>

        </Grid>
      </Grid>
    </Stage>
  );
}
