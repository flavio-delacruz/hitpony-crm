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
  IconButton,
  Modal,
} from "@mui/material";
import { Email, Phone, WhatsApp } from "@mui/icons-material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useAuth } from "../../../../context/AuthContext";
import { useProspectos } from "../../../../context/ProspectosContext"; // Importa el hook del contexto
import EditableAvatar from "./editInformation/EditableAvatar";
import CorreoFlotante from "../../../../components/correos/enviados/CorreoFlotante";
import NotaCard from "../../components/actividades/Notas/NotaCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

// La función 'fetchProspectsAndFindById' ya no es necesaria y se puede eliminar.

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
  // Usa el hook del contexto para acceder a los prospectos
  const { prospectos, loadingProspectos, errorProspectos } = useProspectos(); 

  const [contactData, setContactData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEmail, setOpenEmail] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    // Si los prospectos del contexto están cargando, no hagas nada
    if (loadingProspectos) return; 

    setHasChanges(false);
    const savedData = localStorage.getItem(`contactData-${prospectId}`);
    
    if (savedData) {
      const data = JSON.parse(savedData);
      setContactData(data);
      setInitialData(data);
    } else {
      // Busca el prospecto directamente en el array del contexto
      const prospect = prospectos.find((p) => Number(p.id) === Number(prospectId));
      
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
    }
    // El efecto ahora depende de los datos de 'prospectos' del contexto
  }, [prospectId, prospectos, loadingProspectos]);

  if (loadingProspectos) return <Typography>Cargando...</Typography>;
  if (errorProspectos) return <Typography color="error">Error: {errorProspectos}</Typography>;
  if (!contactData) return <Typography>Prospecto no encontrado.</Typography>;

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

  const handleOpenEmail = () => {
    setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(`Hola ${contactData.nombre}, `);
    window.open(`https://wa.me/${contactData.celular}?text=${message}`, "_blank");
  };

  const handleOpenNoteModal = () => {
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
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

          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <IconButton onClick={handleOpenEmail}>
              <Email />
            </IconButton>
            <IconButton onClick={handleOpenWhatsApp} disabled={!contactData.celular}>
              <WhatsApp />
            </IconButton>
            <IconButton href={`tel:${contactData.celular}`} disabled={!contactData.celular}>
              <Phone />
            </IconButton>
            <IconButton onClick={handleOpenNoteModal}>
              <NoteAddIcon />
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

      <CorreoFlotante
        open={openEmail}
        onClose={handleCloseEmail}
        prospectoId={prospectId}
      />

      <Modal open={isNoteModalOpen} onClose={handleCloseNoteModal}>
        <Box sx={style}>
          <NotaCard
            initialNote={{ id: null, titulo: "", contenido: "" }}
            prospectoId={prospectId}
            onNoteCreated={handleCloseNoteModal}
            onCancel={handleCloseNoteModal}
            isNew={true}
          />
        </Box>
      </Modal>
    </Box>
  );
}