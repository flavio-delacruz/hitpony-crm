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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import ProfileImageCard from "./ProfileImageCard";

const ProfileCard = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState(user);
  
  // **CAMBIO AÑADIDO**: Inicializa el campo 'rol' como editable por defecto
  const [editableFields, setEditableFields] = useState({ rol: true });

  const [localChanges, setLocalChanges] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const prevUserRef = useRef(user);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (JSON.stringify(prevUser) !== JSON.stringify(user)) {
      setFormData(user);
      setLocalChanges(null);
      
      // **CAMBIO AÑADIDO**: Restablece 'rol' como editable al recibir un nuevo 'user'
      setEditableFields({ rol: true });
      
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
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      showAlert("error", "El ID del usuario no está disponible.");
      return;
    }


    // Mapear "rol" a "id_tipo" (asumiendo rol contiene el valor numérico 2 o 3)
    const dataToSend = {
      ...formData,
      funcion: "update",
      id: formData.id,
      id_tipo: formData.rol,
    };

    delete dataToSend.rol; // Eliminar "rol" para evitar duplicados

    // Mapear "correo" a "email" para backend si aplica

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

      // Reconstruir objeto para estado, mapeando email a correo para UI
      const updatedUserWithId = {
        ...formData,
        ...updatedUserFromApi,
        id: formData.id,
      };

      if (updatedUserWithId.email) {
        updatedUserWithId.correo = updatedUserWithId.email;
        delete updatedUserWithId.email;
      }

      setFormData(updatedUserWithId);
      login(updatedUserWithId);
      setEditableFields({ rol: true }); // Restablece los campos a su estado inicial, con rol editable
      showAlert("success", "¡Datos actualizados correctamente!");
    } catch (error) {
      showAlert("error", "Hubo un error actualizando los datos.");
    }
  };

  const toggleFieldEdit = (name) => {
    setEditableFields((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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
    {
      label: "Rol",
      name: "rol",
      type: "select",
<<<<<<< HEAD
      options: [{ value: "closer", label: "Closer" }, { value: "setter", label: "Setter" }],
=======
      options: [
        { value: 2, label: "Setter" },
        { value: 3, label: "Closer" },
      ],
>>>>>>> dac90aa (cambios de roles string por numericos)
    },
  ];

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Collapse
          in={alert.show}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
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
                backgroundColor: alert.type === "success" ? "#ffffff" : "#ffebee",
                color: alert.type === "success" ? "#388e3c" : "#d32f2f",
                boxShadow: 3,
                width: "auto",
                maxWidth: "90%",
                textAlign: "center",
              }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>
      </Box>

      <ProfileImageCard />

      <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3, marginTop: "20px" }}>
        <CardHeader
          title="Editar perfil"
          action={
            localChanges && JSON.stringify(localChanges) !== JSON.stringify(user) ? (
              <Button variant="contained" onClick={handleUpdate}>
                Actualizar
              </Button>
            ) : null
          }
          sx={{ borderBottom: 1, borderColor: "divider", pb: 0 }}
        />

        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
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
                  {field.type === "select" ? (
                    <FormControl fullWidth variant="outlined" disabled={!editableFields[field.name]}>
                      <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                      <Select
                        labelId={`${field.name}-label`}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        label={field.label}
                      >
                        {field.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      type={field.type || "text"}
                      variant="outlined"
                      multiline={field.multiline || false}
                      rows={field.rows || 1}
                      disabled={!editableFields[field.name]}
                    />
                  )}
                  {field.type !== "select" && (
                    <IconButton
                      onClick={() => toggleFieldEdit(field.name)}
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileCard;
