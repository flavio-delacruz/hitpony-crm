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
          with: "100%",
          height: "auto",
          backgroundColor: "#FFF",
          margin: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Grid
          container
          spacing={2}
        >
          {/* Imagen y nombre */}
          <Grid
            item
            xs={3}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                margin: "auto",
              }}
            />
            <Typography
              variant="h6"
              align="center"
              mt={2}
            >
              Elmer Coro Huaman
            </Typography>
          </Grid>

          {/* Biografía */}
          <Grid
            item
            xs={9}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Biografía
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Breve biografía de la persona..."
            />
          </Grid>

          {/* Frase */}
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Frase
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Frase que describe a la persona"
            />
          </Grid>

          {/* Datos personales */}
          <Grid
            item
            xs={6}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Datos Personales
            </Typography>
            <ul>
              <li>Edad: __ años</li>
              <li>Profesión: __</li>
              <li>Estado civil: __</li>
              <li>Ciudad: __</li>
              <li>Arquetipo: __</li>
            </ul>
          </Grid>

          {/* Personalidad */}
          <Grid
            item
            xs={6}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Personalidad
            </Typography>
            <ul>
              <li>Característica 1</li>
              <li>Característica 2</li>
              <li>Característica 3</li>
            </ul>
          </Grid>

          {/* Objetivos */}
          <Grid
            item
            xs={6}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Objetivos
            </Typography>
            <ul>
              <li>Objetivo 1</li>
              <li>Objetivo 2</li>
              <li>Objetivo 3</li>
            </ul>
          </Grid>

          {/* Frustraciones */}
          <Grid
            item
            xs={6}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
            >
              Frustraciones
            </Typography>
            <ul>
              <li>Frustración 1</li>
              <li>Frustración 2</li>
              <li>Frustración 3</li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AffiliateProfilePage;
