// features/login/Login.styles.js
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { brand } from "../../theme";
import { motion } from "framer-motion";

export const REST_OFFSET_VH = -8;
export const EXPANDED_W = 460;
export const EXPANDED_H = 620;

export const Stage = styled(Box)({
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

export const NeonWrap = styled(Box)({
  position: "relative",
  width: 320,
  height: 96,
  borderRadius: 20,
  background: brand.card,
  boxShadow: "0 12px 30px rgba(0,0,0,.45), inset 0 -2px 0 rgba(255,255,255,.04)",
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
  "::before": { left: -12, top: 22, background: `linear-gradient(90deg,${brand.blue},#00ffff00 80%)` },
  "::after": { right: -12, bottom: 22, background: `linear-gradient(270deg,${brand.pink},#ff2d7500 80%)` },
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
    padding: "28px 28px 40px",
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
  "&.expanded .compact, &:hover .compact": { opacity: 0, transform: "translateY(-6px)", pointerEvents: "none" },
  "&.expanded .card, &:hover .card": { opacity: 1, transform: "translateY(0) scale(1)" },
  "@media (max-height: 700px)": {
    "&.expanded, &:hover": { height: "82vh" },
    "& .card": { overflowY: "auto", WebkitOverflowScrolling: "touch" },
  },
});



export const Pill = styled(motion(Box))({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 14,
  padding: "16px 26px",
  borderRadius: 20,
  cursor: "pointer",
  background: "linear-gradient(90deg, #00ffff, #ff2d75, #ff9900, #00ffff)", // 🔥 gradiente cíclico
  backgroundSize: "300% 100%", // más grande para dar efecto de movimiento
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",

  fontSize: 16,
  fontWeight: 600,
  textTransform: "uppercase",
  whiteSpace: "nowrap",

  border: "2px solid #fff ",
  boxShadow:
    "inset 0 0 0 1px rgba(255,255,255,.06), 0 6px 20px rgba(0,0,0,.35)",
});




export const NeonDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "dotColor" && prop !== "dotSize",
})(({ dotColor, dotSize = 12 }) => ({
  display: "inline-block",
  width: dotSize,
  height: dotSize,
  borderRadius: "50%",
  background: dotColor,
  boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}`,
}));



export const GlowTitle = styled(motion(Typography))({
  fontWeight: 800,
  letterSpacing: ".08em",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#ffffff",
  position: "relative",
  overflow: "hidden",
  textShadow: `
    0 0 8px rgba(255,255,255,.4),
    0 0 22px ${brand.blue}55,
    0 0 22px ${brand.purple}40
  `,
});

GlowTitle.defaultProps = {
  animate: {
    textShadow: [
      `0 0 8px rgba(255,255,255,.4), 0 0 22px ${brand.blue}, 0 0 32px ${brand.purple}`,
      `0 0 12px rgba(255,255,255,.6), 0 0 32px ${brand.purple}, 0 0 52px ${brand.blue}`,
      `0 0 6px rgba(255,255,255,.3), 0 0 18px ${brand.blue}55, 0 0 28px ${brand.purple}55`,
      `0 0 10px rgba(255,255,255,.5), 0 0 42px ${brand.blue}, 0 0 62px ${brand.purple}`
    ],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  }
};



export const DividerLine = styled("div")({
  height: 1,
  background: "linear-gradient(90deg,transparent,#2b3247 20%,#2b3247 80%,transparent)",
  marginTop: 6,
  marginBottom: 10,
});
