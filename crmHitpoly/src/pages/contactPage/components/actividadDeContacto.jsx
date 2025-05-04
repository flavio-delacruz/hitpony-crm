import {
    Paper,
    Tabs,
    Tab,
    Box,
    TextField,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
  } from "@mui/material";
  import { Search } from "@mui/icons-material";
  
  export default function ContactActivity() {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: "5px", }}>
        <Tabs value={0} textColor="primary" indicatorColor="primary">
          <Tab label="Descripción" />
          <Tab label="Actividades" />
        </Tabs>
  
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            placeholder="Buscar actividad"
            variant="outlined"
            size="small"
            fullWidth
          />
          <IconButton><Search /></IconButton>
        </Box>
  
        <Typography variant="subtitle2" mt={2}>abril 2025</Typography>
  
        <List>
          <ListItem>
            <ListItemText
              primary={
                <>
                  <Typography variant="body2"><b>Visualización de página</b></Typography>
                  <Typography variant="body2">
                    denis@gmail.com visitó{" "}
                    <b>Hitpoly - Marketing y Desarrollo de Software para el Crecimiento Empresarial</b>
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
                  <Typography variant="body2"><b>Visualización de página</b></Typography>
                  <Typography variant="body2">
                    denis@gmail.com visitó{" "}
                    <b>Hitpoly - Marketing y Desarrollo de Software para el Crecimiento Empresarial</b>
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
                  <Typography variant="body2"><b>Visualización de página</b></Typography>
                  <Typography variant="body2">
                    denis@gmail.com visitó{" "}
                    <b>Hitpoly - Marketing y Desarrollo de Software para el Crecimiento Empresarial</b> y otras 7 páginas
                  </Typography>
                </>
              }
              secondary="12 de abr. de 2025 a las 10:05 AM GMT-5"
            />
          </ListItem>
        </List>
      </Paper>
    );
  }
  