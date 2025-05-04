import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import Grid from "@mui/material/Grid";
import ContactInformation from "./components/infoContact/informacionDeContacto";
import ContactActivity from "./components/actividadDeContacto";
import ContactRelation from "./components/relacionesDeContacto";

export default function ContactPage() {
  const { prospectId } = useParams(); // ← obtener el ID desde la URL

  return (
    <Layout title={"Contactos"}>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12} md={3}>
          <ContactInformation prospectId={parseInt(prospectId)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ContactActivity />
        </Grid>
        <Grid item xs={12} md={3}>
          <ContactRelation />
        </Grid>
      </Grid>
    </Layout>
  );
}
