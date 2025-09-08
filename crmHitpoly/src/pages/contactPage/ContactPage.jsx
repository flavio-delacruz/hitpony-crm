import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import Grid from "@mui/material/Grid";
import ContactInformation from "./components/infoContact/informacionDeContacto";
import ContactActivity from "./components/actividades/actividadDeContacto";
import ContactRelation from "./components/relacionesDeContacto";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { prospectId } = useParams();
  const [extractedProspectId, setExtractedProspectId] = useState(null);

  useEffect(() => {
    if (prospectId) {
      const parts = prospectId.split("-");
      const idPart = parts[parts.length - 1];
      const numericId = parseInt(idPart);
      setExtractedProspectId(numericId);
    }
  }, [prospectId]);

  return (
    <Layout title={"Contactos"}>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12} md={3}>
          {extractedProspectId !== null && (
            <ContactInformation prospectId={extractedProspectId} />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <ContactActivity prospectId={extractedProspectId} />
        </Grid>
        <Grid item xs={12} md={3}>
          <ContactRelation />
        </Grid>
      </Grid>
    </Layout>
  );
}