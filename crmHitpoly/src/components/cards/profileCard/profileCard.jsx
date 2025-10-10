import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  Alert,
  Collapse,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import ProfileImageCard from "./ProfileImageCard";
import { PALETA } from "../../../theme/paleta";

// Tipografía Montserrat (como en Dashboard/CRM/Listas/Contactos/Métricas)
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

/* =========================
   Helpers (modo claro)
========================= */
const UI = {
  sky: PALETA.sky,         // #00C2FF
  cyan: PALETA.cyan,       // #0B8DB5
  purple: PALETA.purple,   // #6C4DE2
  text: PALETA.text,       // #211E26
  panel: PALETA.white,     // #FFFFFF
  border: PALETA.border,   // rgba(11,141,181,.25)
  borderSoft: PALETA.borderSoft || "rgba(11,141,181,.18)",
  shadow: PALETA.shadow,   // "0 8px 30px rgba(33,30,38,.08)"
};

/* =========================
   Fondo con Metaballs sutiles (modo claro)
========================= */
const MetaballsBg = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        filter: "blur(22px) saturate(110%)",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            x: [20 * i, -40 * (i + 1), 30 * (i + 1), 0],
            y: [-10 * i, 30 * (i + 1), -25 * (i + 1), 0],
          }}
          transition={{ repeat: Infinity, duration: 12 + i * 2, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            width: 220 + i * 40,
            height: 220 + i * 40,
            top: ["10%", "60%", "30%", "70%", "20%", "50%"][i],
            left: ["5%", "70%", "40%", "15%", "80%", "55%"][i],
            borderRadius: "9999px",
            background: `radial-gradient(circle at 30% 30%, ${UI.sky}22, ${UI.cyan}22 55%, transparent 70%),
                         radial-gradient(circle at 70% 70%, ${UI.purple}22, transparent 60%)`,
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
      ))}
    </Box>
  );
};

/* =========================
   Botón gradiente (acción principal)
========================= */
const NeonButton = (props) => (
  <Button
    {...props}
    sx={{
      borderRadius: 12,
      px: 2.4,
      py: 1.1,
      fontWeight: 900,
      letterSpacing: ".02em",
      color: "#FFFFFF",
      textTransform: "none",
      background: `linear-gradient(90deg, ${UI.sky} 0%, ${UI.cyan} 45%, ${UI.purple} 100%)`,
      boxShadow: "0 10px 24px rgba(0,0,0,.18)",
      "&:hover": { filter: "brightness(1.06)", boxShadow: "0 14px 34px rgba(0,0,0,.24)" },
      ...props.sx,
    }}
  />
);

/* =========================
   Card con borde degradado animado + shimmer + hover 3D
========================= */
const NeonCard = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ y: 16, opacity: 0, rotateX: 0, rotateY: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{
      rotateX: -2,
      rotateY: 2,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    }}
    style={{ transformStyle: "preserve-3d" }}
    sx={{ position: "relative", borderRadius: 18, overflow: "hidden", ...sx }}
  >
    {/* Borde animado */}
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        p: "1px",
        borderRadius: 18,
        background: `linear-gradient(120deg, ${UI.sky}, ${UI.cyan} 35%, ${UI.purple} 80%, ${UI.sky})`,
        backgroundSize: "220% 220%",
        opacity: 0.85,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* shimmer sutil */}
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Box
        component={motion.div}
        initial={false}
        whileHover={{ x: ["-120%", "120%"] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          transform: "skewX(-20deg)",
          background:
            "linear-gradient(120deg, transparent 0, rgba(0,194,255,.12) 20%, transparent 40%)",
        }}
      />
    </Box>
    {children}
  </Box>
);

/* =========================
   Título Montserrat 900 con degradado + animación por letra
========================= */
const NeonTitle = ({ text }) => (
  <Typography
    component="div"
    sx={{
      fontFamily:
        "'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 900,
      letterSpacing: ".02em",
      lineHeight: 1.05,
      fontSize: { xs: 28, sm: 34 },
    }}
  >
    {text.split("").map((ch, i) =>
      ch === " " ? (
        <span key={`sp-${i}`} style={{ display: "inline-block", width: "0.35em" }}>
          &nbsp;
        </span>
      ) : (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, type: "spring", stiffness: 260, damping: 18 }}
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg,#00C2FF,#6C4DE2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 10px rgba(108,77,226,.20), 0 0 12px rgba(11,141,181,.18)",
          }}
        >
          {ch}
        </motion.span>
      )
    )}
  </Typography>
);

/* =========================
   TextField estilizado (modo claro)
========================= */
const NeonTextField = ({ editable, ...props }) => (
  <TextField
    {...props}
    variant="outlined"
    disabled={!editable}
    sx={{
      "& .MuiInputLabel-root": {
        color: "rgba(33,30,38,.7)",
        fontWeight: 700,
        letterSpacing: ".02em",
      },
      "& label.Mui-focused": {
        color: UI.cyan,
        textShadow: "0 0 8px rgba(11,141,181,.25)",
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 14,
        background: "#FFFFFF",
        color: UI.text,
        transition: "transform .12s ease",
        "& fieldset": {
          borderColor: UI.border,
        },
        "&:hover fieldset": {
          borderColor: UI.cyan,
        },
        "&.Mui-focused": {
          transform: "translateY(-1px)",
        },
        "&.Mui-focused fieldset": {
          borderColor: UI.sky,
          boxShadow:
            "0 0 0 2px rgba(0,194,255,.25), 0 0 14px rgba(11,141,181,.18)",
        },
      },
      "& .MuiInputBase-input": {
        fontWeight: 600,
        letterSpacing: ".01em",
      },
    }}
  />
);

/* =========================
   Componente principal
========================= */
const ProfileCard = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState(user);
  const [editableFields, setEditableFields] = useState({});
  const [localChanges, setLocalChanges] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const prevUserRef = useRef(user);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (JSON.stringify(prevUser) !== JSON.stringify(user)) {
      setFormData(user);
      setLocalChanges(null);
      setEditableFields({});
      prevUserRef.current = user;
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setLocalChanges(updated);
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      showAlert("error", "El ID del usuario no está disponible.");
      return;
    }
    const dataToSend = {
      ...formData,
      funcion: "update",
      id: formData.id,
      id_tipo: formData.rol,
    };
    if (dataToSend.correo) {
      dataToSend.email = dataToSend.correo;
      delete dataToSend.correo;
    }

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/updateSetterController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      if (!response.ok) throw new Error("Error actualizando los datos");

      const updatedUserFromApi = await response.json();
      const updatedUserWithId = { ...formData, ...updatedUserFromApi, id: formData.id };
      if (updatedUserWithId.email) {
        updatedUserWithId.correo = updatedUserWithId.email;
        delete updatedUserWithId.email;
      }
      setFormData(updatedUserWithId);
      login(updatedUserWithId);
      setEditableFields({});
      showAlert("success", "¡Datos actualizados correctamente!");
    } catch (error) {
      showAlert("error", "Hubo un error actualizando los datos.");
    }
  };

  const toggleFieldEdit = (name) =>
    setEditableFields((prev) => ({ ...prev, [name]: !prev[name] }));

  if (!user) return null;

  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Apellido", name: "apellido" },
    { label: "Correo", name: "correo", type: "email" },
    { label: "Teléfono", name: "telefono" },
    { label: "Dirección", name: "direccion" },
    { label: "Ciudad", name: "ciudad" },
    { label: "País", name: "pais" },
    { label: "Código Postal", name: "codigo_postal" },
    { label: "Sobre mí", name: "sobre_mi", multiline: true, rows: 3 },
  ];

  const hasChanges =
    localChanges && JSON.stringify(localChanges) !== JSON.stringify(user);

  return (
    <Box sx={{ position: "relative", background: UI.panel }}>
      {/* Fondo metaballs */}
      <MetaballsBg />

      {/* Alert claro centrado */}
      <Box sx={{ position: "relative" }}>
        <Collapse in={alert.show} sx={{ position: "absolute", inset: 0, zIndex: 10 }}>
          {alert.show && (
            <Alert
              severity={alert.type}
              sx={{
                position: "fixed",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                px: 3,
                py: 1,
                borderRadius: 2,
                background: "#FFFFFF",
                color: alert.type === "success" ? UI.cyan : "#D92D20",
                border: `1px solid ${
                  alert.type === "success" ? "rgba(11,141,181,.35)" : "rgba(217,45,32,.35)"
                }`,
                boxShadow: "0 18px 40px rgba(0,0,0,.18)",
              }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>
      </Box>

      {/* Card de avatar/perfil (si quieres, también puedes envolverla en NeonCard desde dentro de ProfileImageCard) */}
      <ProfileImageCard />

      {/* Card del formulario */}
      <NeonCard
        sx={{
          mt: 2,
          background: UI.panel,
          boxShadow: UI.shadow,
          border: `1px solid ${UI.border}`,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 18,
            p: { xs: 2, sm: 3 },
            background: "#FFFFFF",
            color: UI.text,
          }}
        >
          <CardHeader
            sx={{ pb: 0.5, borderBottom: `1px solid ${UI.border}` }}
            title={<NeonTitle text="Editar perfil" />}
            action={hasChanges ? <NeonButton onClick={handleUpdate}>Actualizar</NeonButton> : null}
          />

          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                color: "rgba(33,30,38,.6)",
                letterSpacing: ".12em",
                mb: 2,
                fontWeight: 800,
              }}
            >
              Información del usuario
            </Typography>

            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid
                  item
                  xs={12}
                  md={field.name === "sobre_mi" ? 12 : 6}
                  key={field.name}
                >
                  <Box sx={{ position: "relative" }}>
                    <NeonTextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      type={field.type || "text"}
                      multiline={field.multiline || false}
                      rows={field.rows || 1}
                      editable={!!editableFields[field.name]}
                    />
                    <Tooltip
                      title={editableFields[field.name] ? "Bloquear campo" : "Editar campo"}
                    >
                      <IconButton
                        onClick={() => toggleFieldEdit(field.name)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: editableFields[field.name] ? UI.cyan : "rgba(33,30,38,.5)",
                          "&:hover": {
                            color: UI.purple,
                            textShadow: "0 0 10px rgba(108,77,226,.25)",
                          },
                          transition: "color .2s ease",
                          background: "#FFFFFF",
                          borderRadius: 10,
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </NeonCard>
    </Box>
  );
};

export default ProfileCard;
