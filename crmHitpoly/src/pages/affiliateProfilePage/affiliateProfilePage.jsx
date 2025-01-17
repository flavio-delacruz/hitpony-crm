import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Grid,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "../../components/layout/layout";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const AffiliateProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "Karol Juárez",
    apellidos: "Castro",
    correo: "karol.juarez@example.com",
    telefono: "987654321",
    direccion: "Av. Siempre Viva 123",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log("Información actualizada:", formData);
    handleClose();
  };

  return (
    <Layout title={"Perfil"}>
      <Box sx={{ p: 4 }}>
        <Card sx={{ maxWidth: 400, mx: "auto", boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar sx={{ width: 100, height: 100 }}>KJ</Avatar>
            </Box>
            <Typography
              variant="h6"
              align="center"
            >{`${formData.nombre} ${formData.apellidos}`}</Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
            >
              {formData.correo}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
            >{`Teléfono: ${formData.telefono}`}</Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
            >{`Dirección: ${formData.direccion}`}</Typography>
            <Box
              mt={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleOpen}
              >
                Editar Perfil
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Modal para editar información */}
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={modalStyle}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Editar Información Personal
            </Typography>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box
              mt={3}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
};

export default AffiliateProfilePage;
