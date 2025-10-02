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

/* =========================
   Paleta / helpers
========================= */
const ui = {
  cyan: "#00EAF0",
  blue: "#0B8DB5",
  pink: "#FF2D75",
  purple: "#6C4DE2",
  text: "#E8ECF1",
  sub: "#A7B1C1",
  panel: "#0b0f14",
};

const NeonButton = (props) => (
  <Button
    {...props}
    sx={{
      borderRadius: 999,
      px: 2.4,
      py: 1,
      fontWeight: 900,
      letterSpacing: ".02em",
      color: "#0b0f14",
      textTransform: "none",
      background: `linear-gradient(90deg, ${ui.cyan} 0%, ${ui.blue} 45%, ${ui.pink} 100%)`,
      boxShadow: "0 10px 24px rgba(0,0,0,.35)",
      "&:hover": { filter: "brightness(1.06)" },
      ...props.sx,
    }}
  />
);

/* Card con borde degradado animado + shimmer */
const NeonCard = ({ children, sx }) => (
  <Box
    component={motion.div}
    initial={{ y: 12, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 220, damping: 24 }}
    sx={{ position: "relative", borderRadius: 16, overflow: "hidden", ...sx }}
  >
    <Box
      component={motion.div}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      sx={{
        position: "absolute",
        inset: 0,
        p: "1px",
        borderRadius: 16,
        background:
          "linear-gradient(120deg,#00EAF0,#0B8DB5 40%,#FF2D75 85%,#00EAF0)",
        backgroundSize: "200% 200%",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    />
    {/* shimmer suave en hover */}
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Box
        component={motion.div}
        whileHover={{ x: ["-120%", "120%"] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          transform: "skewX(-20deg)",
          background:
            "linear-gradient(120deg, transparent 0, rgba(255,255,255,.08) 20%, transparent 40%)",
        }}
      />
    </Box>
    {children}
  </Box>
);

/* Título con glow y letras en stagger */
const NeonTitle = ({ text }) => (
  <Typography
    component="div"
    sx={{
      fontFamily: "'Gravitas One', serif",
      fontWeight: 900,
      color: ui.text,
      letterSpacing: ".04em",
      wordSpacing: ".25em",
      fontSize: { xs: 26, sm: 30 },
      lineHeight: 1.05,
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
            textShadow:
              "0 1px 0 rgba(0,0,0,.25), 0 0 18px rgba(11,141,181,.45), 0 0 12px rgba(255,45,117,.35)",
          }}
    >
          {ch}
        </motion.span>
      )
    )}
  </Typography>
);

/* TextField estilizado neon */
const NeonTextField = ({ editable, ...props }) => (
  <TextField
    {...props}
    variant="outlined"
    disabled={!editable}
    sx={{
      "& .MuiInputLabel-root": {
        color: "rgba(232,236,241,.8)",
        fontWeight: 700,
        letterSpacing: ".02em",
      },
      "& label.Mui-focused": {
        color: ui.cyan,
        textShadow: "0 0 10px rgba(0,234,240,.45)",
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        background: "rgba(255,255,255,.03)",
        color: ui.text,
        "& fieldset": {
          borderColor: "rgba(255,255,255,.12)",
        },
        "&:hover fieldset": {
          borderColor: ui.blue,
        },
        "&.Mui-focused fieldset": {
          borderColor: ui.cyan,
          boxShadow:
            "0 0 0 2px rgba(0,234,240,.35), 0 0 20px rgba(255,45,117,.2)",
        },
      },
      "& .MuiInputBase-input": {
        fontWeight: 600,
        letterSpacing: ".02em",
      },
    }}
  />
);

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
    <Box>
      {/* Alert neon centrado */}
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
                background: ui.panel,
                color: alert.type === "success" ? ui.cyan : ui.pink,
                border: `1px solid ${
                  alert.type === "success" ? "rgba(0,234,240,.45)" : "rgba(255,45,117,.45)"
                }`,
                boxShadow:
                  "0 20px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06)",
              }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>
      </Box>

      <ProfileImageCard />

      <NeonCard sx={{ mt: 2, background: ui.panel, boxShadow: "0 18px 50px rgba(0,0,0,.55)" }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            background:
              "radial-gradient(1200px 450px at -10% -20%, rgba(11,141,181,.16), transparent 60%), radial-gradient(1100px 420px at 120% 120%, rgba(255,45,117,.12), transparent 60%), #0b0f14",
            color: ui.text,
          }}
        >
          <CardHeader
            sx={{ pb: 0, borderBottom: "1px solid rgba(255,255,255,.08)" }}
            title={<NeonTitle text="Editar perfil" />}
            action={
              hasChanges ? (
                <NeonButton onClick={handleUpdate}>Actualizar</NeonButton>
              ) : null
            }
          />

          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                color: ui.sub,
                letterSpacing: ".12em",
                mb: 2,
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
                      title={
                        editableFields[field.name]
                          ? "Bloquear campo"
                          : "Editar campo"
                      }
                    >
                      <IconButton
                        onClick={() => toggleFieldEdit(field.name)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: editableFields[field.name] ? ui.cyan : ui.sub,
                          "&:hover": {
                            color: ui.pink,
                            textShadow: "0 0 10px rgba(255,45,117,.45)",
                          },
                          transition: "color .2s ease",
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
