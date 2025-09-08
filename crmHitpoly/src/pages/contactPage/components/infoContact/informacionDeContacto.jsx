// src/components/ContactInformation.js

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
  IconButton, // Importar IconButton
} from "@mui/material";
import { Email, Phone, WhatsApp } from "@mui/icons-material"; // Importar WhatsApp
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useAuth } from "../../../../context/AuthContext";
import EditableAvatar from "./editInformation/EditableAvatar";
import CorreoFlotante from "../../../../components/correos/enviados/CorreoFlotante"; // Importar CorreoFlotante

const fetchProspectsAndFindById = async (user, prospectId) => {
  if (!user || !user.id) return null;

  const { id, id_tipo } = user;

  try {
    let allProspects = [];
    if (id_tipo === "3" || id_tipo === 3) {
      const asignacionesResponse = await fetch(
        "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        }
      );
      const asignacionesData = await asignacionesResponse.json();
      let setterIds = [];
      if (asignacionesData.data && asignacionesData.data.length > 0) {
        const asignacionDelCloser = asignacionesData.data.find(
          (asignacion) => Number(asignacion.id_closer) === Number(id)
        );
        if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
          try {
            const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
            if (Array.isArray(parsedSetters)) {
              setterIds = parsedSetters;
            }
          } catch (e) {}
        }
      }
      const promises = setterIds.map((setterId) =>
        fetch(
          "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
          }
        ).then((res) => res.json())
      );
      const allProspectsFromSetters = await Promise.all(promises);
      allProspects = allProspectsFromSetters.flatMap(
        (data) => data.resultado || []
      );
    }

    // Cargar prospectos del usuario actual
    const userProspectsResponse = await fetch(
      "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcion: "getProspectos", id: id }),
      }
    );
    const userProspectsData = await userProspectsResponse.json();
    const prospectsFromUser = userProspectsData.resultado || [];

    const finalProspects =
      id_tipo === "3" || id_tipo === 3
        ? [...allProspects, ...prospectsFromUser]
        : prospectsFromUser;

    const prospect = finalProspects.find(
      (p) => Number(p.id) === Number(prospectId)
    );
    return prospect;
  } catch (error) {
    return null;
  }
};

const EditableField = ({ label, value, onChange }) => (
  <Grid item xs={12}>
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
      multiline={label === "Descripción" || label === "Productos de Interés"}
      minRows={label === "Descripción" || label === "Productos de Interés" ? 2 : 1}
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
  // Estado para controlar el CorreoFlotante
  const [openEmail, setOpenEmail] = useState(false);

  useEffect(() => {
    setHasChanges(false);
    const savedData = localStorage.getItem(`contactData-${prospectId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setContactData(data);
      setInitialData(data);
    } else {
      fetchProspectsAndFindById(user, prospectId).then((prospect) => {
        if (prospect) {
          const normalizedProspect = {
            ...prospect,
            email: prospect.email || prospect.correo,
            productos_interes: prospect.productos_interes || "",
          };
          setContactData(normalizedProspect);
          setInitialData(normalizedProspect);
        } else {
          setContactData({});
        }
      });
    }
  }, [prospectId, user]);

  if (!contactData) return <Typography>Cargando...</Typography>;

  const updateField = (field) => (value) => {
    setContactData((prev) => {
      const updatedData = { ...prev, [field]: value };
      localStorage.setItem(
        `contactData-${prospectId}`,
        JSON.stringify(updatedData)
      );
      checkForChanges(updatedData);
      return updatedData;
    });
  };

  const checkForChanges = (updatedData) => {
    const isChanged = Object.keys(updatedData).some((key) => {
      if (key === "avatar") return false;
      const initial = initialData?.[key] ?? "";
      const current = updatedData?.[key] ?? "";
      return initial !== current;
    });
    setHasChanges(isChanged);
  };

  const handleUpdate = () => {
    const updatedData = {
      funcion: "update",
      id: contactData.id,
      nombre: contactData.nombre,
      apellido: contactData.apellido,
      email: contactData.email,
      correo_corporativo: contactData.correo_corporativo,
      celular: contactData.celular,
      descripcion: contactData.descripcion,
      sector: contactData.sector,
      direccion: contactData.direccion,
      ciudad: contactData.ciudad,
      pais: contactData.pais,
      productos_interes: contactData.productos_interes,
    };

    setContactData((prev) => ({ ...prev, ...updatedData }));

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

  // Función para abrir el CorreoFlotante
  const handleOpenEmail = () => {
    setOpenEmail(true);
  };

  // Función para cerrar el CorreoFlotante
  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(`Hola ${contactData.nombre}, `);
    window.open(`https://wa.me/${contactData.celular}?text=${message}`, '_blank');
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
                checkForChanges(updatedData);
                return updatedData;
              })
            }
          />
          <Typography variant="body1">{contactData.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {contactData.email || "Correo no disponible"}
          </Typography>

          {/* Iconos de correo, WhatsApp y teléfono */}
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            {/* 1. Icono de Correo (llama a CorreoFlotante) */}
            <IconButton onClick={handleOpenEmail}>
              <Email />
            </IconButton>
            {/* 2. Icono de WhatsApp */}
            <IconButton onClick={handleOpenWhatsApp} disabled={!contactData.celular}>
              <WhatsApp />
            </IconButton>
            {/* 3. Icono de Teléfono */}
            <IconButton href={`tel:${contactData.celular}`} disabled={!contactData.celular}>
              <Phone />
            </IconButton>
          </Box>
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
            label="Producto de Interés"
            value={contactData.productos_interes}
            onChange={updateField("productos_interes")}
          />
          <EditableField
            label="Descripción"
            value={contactData.descripcion}
            onChange={updateField("descripcion")}
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
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Correo Flotante */}
      <CorreoFlotante
        open={openEmail}
        onClose={handleCloseEmail}
        prospectoId={prospectId}
      />
    </Box>
  );
}