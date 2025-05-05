import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Email, Phone, MoreVert } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useAuth } from "../../../../context/AuthContext";
import EditableAvatar from "./editInformation/EditableAvatar";

const EditableField = ({ label, value, onChange }) => (
  <Grid item xs={12}>
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
    />
  </Grid>
);

export default function ContactInformation({ prospectId }) {
  const { user } = useAuth();
  const [contactData, setContactData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setHasChanges(false); // Reinicia cambios cuando cambia de prospecto
    const savedData = localStorage.getItem(`contactData-${prospectId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setContactData(data);
      setInitialData(data);
    } else {
      fetch(
        "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funcion: "getProspectos", id: user?.id || 0 }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const prospect = data?.resultado?.find(
            (p) => Number(p.id) === Number(prospectId)
          );
          if (prospect) {
            setContactData(prospect);
            setInitialData(prospect);
          } else {
          }
        })
        .catch(console.error);
    }
  }, [prospectId, user]);

  if (!contactData) return <Typography>Cargando...</Typography>;

  const updateField = (field) => (value) => {
    setContactData((prev) => {
      const updatedData = { ...prev, [field]: value };
      // Guardamos los cambios en localStorage cada vez que se actualiza un campo
      localStorage.setItem(
        `contactData-${prospectId}`,
        JSON.stringify(updatedData)
      );

      // Detectamos si hubo algún cambio
      checkForChanges(updatedData);

      return updatedData;
    });
  };

  const checkForChanges = (updatedData) => {
    const isChanged = Object.keys(updatedData).some((key) => {
      if (key === "avatar") return false; // Ignorar cambios en el avatar
      const initial = initialData?.[key] ?? "";
      const current = updatedData?.[key] ?? "";
      return initial !== current;
    });
    setHasChanges(isChanged);
  };

  const handleUpdate = () => {
    // Actualizamos los datos en el backend
    const updatedData = {
      funcion: "update",
      id: contactData.id,
      nombre: contactData.nombre,
      apellido: contactData.apellido,
      email: contactData.email,
      correo_corporativo: contactData.correo_corporativo,
      celular: contactData.celular,
      descripcion: contactData.descripcion,
      estado_contacto: contactData.estado_contacto,
      sector: contactData.sector,
      direccion: contactData.direccion,
      ciudad: contactData.ciudad,
      pais: contactData.pais,
    };

    // Actualización local de los datos
    setContactData((prev) => ({ ...prev, ...updatedData }));

    // Realizar la actualización al backend
    fetch("https://apiweb.hitpoly.com/ajax/updateProspectoController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSnackbarMessage("Los datos se actualizaron correctamente");
          setOpenSnackbar(true);
          setHasChanges(false);
          setInitialData(updatedData);
        } else {
          setSnackbarMessage(
            "Hubo un problema al actualizar. Inténtalo nuevamente."
          );
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        setSnackbarMessage("Hubo un error al realizar la solicitud.");
        setOpenSnackbar(true);
      });
  };

  return (
    <Box
      sx={{
        height: { xs: "90vh", md: "80vh" },
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9f9f9",
        borderRadius: "5px 0px 0px 0px",
        position: "relative",
      }}
    >
      <Paper
        elevation={2}
        sx={{ flex: "none", p: 2, borderRadius: "5px 0px 0px 0px" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <EditableAvatar
            contactData={contactData}
            onAvatarChange={(newUrl) =>
              setContactData((prev) => {
                const updatedData = { ...prev, avatar: newUrl };
                localStorage.setItem(
                  `contactData-${prospectId}`,
                  JSON.stringify(updatedData)
                );
                checkForChanges(updatedData); // Se verifica si hubo cambios
                return updatedData;
              })
            }
          />
          <Typography variant="body1">{contactData.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {contactData.email || "Correo no disponible"}
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          borderRadius: "0px 0px 5px 5px",
        }}
      >
        <Grid container spacing={1}>
          <EditableField
            label="Nombre"
            value={contactData.nombre}
            onChange={updateField("nombre")}
          />
          <EditableField
            label="Apellido"
            value={contactData.apellido}
            onChange={updateField("apellido")}
          />
          <EditableField
            label="Correo"
            value={contactData.email}
            onChange={updateField("email")}
          />
          <EditableField
            label="Correo Corporativo"
            value={contactData.correo_corporativo}
            onChange={updateField("correo_corporativo")}
          />
          <Grid item xs={12}>
            <PhoneInput
              country={"pe"}
              value={contactData.celular || ""}
              onChange={(phone) => updateField("celular")(phone)}
              inputStyle={{ width: "100%", height: "56px", fontSize: "16px" }}
              containerStyle={{ width: "100%" }}
              inputProps={{ name: "phone", required: true }}
              enableSearch
            />
          </Grid>
          <EditableField
            label="Descripción"
            value={contactData.descripcion}
            onChange={updateField("descripcion")}
          />
          <EditableField
            label="Estado del contacto"
            value={contactData.estado_contacto}
            onChange={updateField("estado_contacto")}
          />
          <EditableField
            label="Sector"
            value={contactData.sector}
            onChange={updateField("sector")}
          />
          <EditableField
            label="Dirección"
            value={contactData.direccion}
            onChange={updateField("direccion")}
          />
          <EditableField
            label="Ciudad"
            value={contactData.ciudad}
            onChange={updateField("ciudad")}
          />
          <EditableField
            label="País"
            value={contactData.pais}
            onChange={updateField("pais")}
          />
        </Grid>
      </Paper>

      {hasChanges && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            sx={{ position: "absolute", width: "100%", top: 2 }}
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            Guardar Cambios
          </Button>
        </Box>
      )}

      {/* Snackbar para mostrar el mensaje */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "white", // Fondo blanco
            color: "black", // Texto negro
            border: "1px solid #ccc", // Opcional: borde gris claro (si quieres darle un contorno)
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
