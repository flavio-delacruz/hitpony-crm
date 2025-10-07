// features/login/SplitText.jsx
import { motion } from "framer-motion";

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
            fontSize: "35px",
            fontWeight: "bold",
            color,
            fontFamily,
          }}
        >
          {char === " " ? "\u00A0" : char} {/* maneja espacios */}
        </motion.span>
      ))}
    </motion.span>
  );
}

