import {
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import Layout from "../../components/layout/layout";

const AffiliateProfilePage = () => {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          maxWidth: 800,
          margin: "auto",
          backgroundColor: "#fff",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: { md: 2 },
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              marginBottom: 2,
            }}
          />
          <Typography
            variant="h6"
            gutterBottom
          >
            Afiliado Profile
          </Typography>
          <Typography variant="body1">Elmer Coro Huaman</Typography>
          <Typography variant="body2">corohuamanelmer@gmail.com</Typography>
          <Typography variant="body2">976 367 567</Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />

        {/* Right Side */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            marginTop: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
          >
            Edition Information
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
                label="Telefono"
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
                label="Ciudad"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
            >
              Restablecer
            </Button>
            <Button
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AffiliateProfilePage;
