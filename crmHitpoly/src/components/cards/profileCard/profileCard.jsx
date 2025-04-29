import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Grid,
} from "@mui/material";

const ProfileCard = () => {
  return (
    <Card
      sx={{
        padding: "20px",
        borderRadius: "15px",
        height: { sx: "auto", md: "100%" },
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardHeader
        title="Editar perfil"
        sx={{ borderBottom: 1, borderColor: "divider", pb: 0 }}
      />
      <CardContent>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          Informacion del usuario
        </Typography>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Nombre"
              defaultValue="lucky.jesse"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="apellido"
              defaultValue="Jesse"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Correo"
              defaultValue="jesse@example.com"
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Segundo apellido"
              defaultValue="Lucky"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          Informacion de contacto
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
              label="Direccion"
              defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="Ciudad"
              defaultValue="New York"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="Pais"
              defaultValue="United States"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="Codigo postal"
              defaultValue="437300"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          Sobre mi
        </Typography>
        <TextField
          fullWidth
          label="Sobre mi"
          defaultValue="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."
          variant="outlined"
          multiline
          rows={3}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
