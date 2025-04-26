import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { Email, Phone, MoreVert, Search } from "@mui/icons-material";
import Layout from "../../components/layout/layout";

export default function ContactPage() {
  return (
    <>
      <Layout title={"Contactos"}>
        <Grid
          container
          spacing={2}
          p={2}
        >
          {/* Left Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
          >
            <Paper
              elevation={2}
              sx={{ p: 2 }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar sx={{ width: 60, height: 60, mb: 1 }}>D</Avatar>
                <Typography variant="body1">denis@gmail.com</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  denis@gmail.com
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={2}
                  width="100%"
                >
                  <IconButton>
                    <Email />
                  </IconButton>
                  <IconButton>
                    <Phone />
                  </IconButton>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">Correo</Typography>
              <Typography
                variant="body2"
                mb={1}
              >
                denis@gmail.com, rebeco@gmail.com
              </Typography>

              <Typography variant="subtitle2">Número de teléfono</Typography>
              <Typography
                variant="body2"
                mb={1}
              >
                ---
              </Typography>

              <Typography variant="subtitle2">Objetivo de marketing</Typography>
              <Typography
                variant="body2"
                mb={1}
              >
                ---
              </Typography>

              <Typography variant="subtitle2">Presupuesto</Typography>
              <Typography
                variant="body2"
                mb={1}
              >
                ---
              </Typography>

              <Typography variant="subtitle2">Estado del lead</Typography>
              <Typography variant="body2">---</Typography>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid
            item
            xs={12}
            md={6}
          >
            <Paper
              elevation={2}
              sx={{ p: 2 }}
            >
              <Tabs
                value={0}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Descripción" />
                <Tab label="Actividades" />
              </Tabs>

              <Box
                display="flex"
                alignItems="center"
                mt={2}
              >
                <TextField
                  placeholder="Buscar actividad"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <IconButton>
                  <Search />
                </IconButton>
              </Box>

              <Typography
                variant="subtitle2"
                mt={2}
              >
                abril 2025
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body2">
                          <b>Visualización de página</b>
                        </Typography>
                        <Typography variant="body2">
                          denis@gmail.com visitó{" "}
                          <b>
                            Hitpoly - Marketing y Desarrollo de Software para el
                            Crecimiento Empresarial
                          </b>
                        </Typography>
                      </>
                    }
                    secondary="12 de abr. de 2025 a las 4:02 PM GMT-5"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body2">
                          <b>Visualización de página</b>
                        </Typography>
                        <Typography variant="body2">
                          denis@gmail.com visitó{" "}
                          <b>
                            Hitpoly - Marketing y Desarrollo de Software para el
                            Crecimiento Empresarial
                          </b>
                        </Typography>
                      </>
                    }
                    secondary="12 de abr. de 2025 a las 3:58 PM GMT-5"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body2">
                          <b>Visualización de página</b>
                        </Typography>
                        <Typography variant="body2">
                          denis@gmail.com visitó{" "}
                          <b>
                            Hitpoly - Marketing y Desarrollo de Software para el
                            Crecimiento Empresarial
                          </b>{" "}
                          y otras 7 páginas
                        </Typography>
                      </>
                    }
                    secondary="12 de abr. de 2025 a las 10:05 AM GMT-5"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
          >
            <Paper
              elevation={2}
              sx={{ p: 2 }}
            >
              <Typography
                variant="subtitle1"
                mb={1}
              >
                Empresas (0)
              </Typography>
              <Button size="small">+ Agregar</Button>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                mb={1}
              >
                Negocios (0)
              </Typography>
              <Button size="small">+ Agregar</Button>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                mb={1}
              >
                Tickets (0)
              </Typography>
              <Button size="small">+ Agregar</Button>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                mb={1}
              >
                Enlaces de pago (0)
              </Typography>
              <Button size="small">Configurar pagos</Button>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                mb={1}
              >
                Contactos (0)
              </Typography>
              <Button size="small">+ Agregar</Button>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}
