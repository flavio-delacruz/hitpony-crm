// features/login/SplitText.jsx
import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";
const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // intervalo entre letras
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 30, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};


export default function SplitText({ text, color, fontFamily }) {
  const theme = useTheme();

  // Detecta el tamaño de pantalla
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Ajusta tamaño dinámicamente
  const fontSize = isXs ? "17px" : isMd ? "28px" : "40px";

  return (
    <motion.span
      key={text}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          style={{
            display: "inline-block",
            fontSize,
            fontWeight: "bold",
            color,
            fontFamily,
            
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

