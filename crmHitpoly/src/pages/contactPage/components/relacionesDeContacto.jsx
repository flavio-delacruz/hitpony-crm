import { Paper, Typography, Divider, Button } from "@mui/material";

export default function ContactRelation() {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: "0px 5px 5px 0px", }}>
      <Typography variant="subtitle1" mb={1}>Empresas (0)</Typography>
      <Button size="small">+ Agregar</Button>
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" mb={1}>Negocios (0)</Typography>
      <Button size="small">+ Agregar</Button>
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" mb={1}>Tickets (0)</Typography>
      <Button size="small">+ Agregar</Button>
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" mb={1}>Enlaces de pago (0)</Typography>
      <Button size="small">Configurar pagos</Button>
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" mb={1}>Contactos (0)</Typography>
      <Button size="small">+ Agregar</Button>
    </Paper>
  );
}
