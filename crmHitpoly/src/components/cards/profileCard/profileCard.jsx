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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import ProfileImageCard from "./ProfileImageCard";
import Swal from "sweetalert2";

const ProfileCard = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState(user);
  const [editableFields, setEditableFields] = useState({});
  const [localChanges, setLocalChanges] = useState(null);
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

  const handleUpdate = async () => {
    if (!formData.id) {
      alert("El ID del usuario no está disponible.");
      return;
    }

    try {
      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/updateSetterController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            ...formData,
            id: formData.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Error actualizando los datos");

      const updatedUser = await response.json();
      const updatedUserWithId = {
        ...formData,
        ...updatedUser,
        id: formData.id,
      };

      setFormData(updatedUserWithId);
      login(updatedUserWithId);
      setEditableFields({});
       Swal.fire({
                icon: 'success',
                title: '¡Datos actualizados correctamente!',
                text: 'Has editado los datos correctamente',
              });
      
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error actualizando los datos!",
        footer: '<a href="#">Por que tengo este problema?</a>'
      });
    
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
  ];

  return (
    <Box>
      <ProfileImageCard />
      <Card
        sx={{ padding: 3, borderRadius: 3, boxShadow: 3, marginTop: "20px" }}
      >
        <CardHeader
          title="Editar perfil"
          action={
            localChanges &&
            JSON.stringify(localChanges) !== JSON.stringify(user) ? (
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
                  <IconButton
                    onClick={() => toggleFieldEdit(field.name)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
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
