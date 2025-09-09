import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import Layout from "../../layout/layout";
import { useAuth } from "../../../context/AuthContext";

const API_BASE_URL = "https://apiweb.hitpoly.com/ajax/";

function EnviarCorreo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProspectIds } = location.state || { selectedProspectIds: [] };
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientEmails, setRecipientEmails] = useState([]);
  const { user } = useAuth();
  const defaultSenderEmail = "correo_por_defecto@example.com";

  useEffect(() => {
    const fetchSelectedProspects = async () => {
      if (user?.id && selectedProspectIds.length > 0) {
        
        try {
          const promises = selectedProspectIds.map((prospectoId) =>
            fetch("https://apiweb.hitpoly.com/ajax/traerProsxIdController.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accion: "getProspecto",
                id: prospectoId,
              }),
            }).then((res) => res.json())
          );

          const allProspectsData = await Promise.all(promises);

          const emails = allProspectsData
            .map((data) => data.resultado?.correo)
            .filter((email) => email);
            
          setRecipientEmails(emails);
          } catch (error) {
          Swal.fire("Error", "Error al obtener los prospectos.", "error");
        }
      } else if (selectedProspectIds.length === 0) {
        setRecipientEmails([]);
      }
    };

    fetchSelectedProspects();
  }, [user?.id, selectedProspectIds]);

  const handleEnviarCorreo = async () => {
    if (recipientEmails.length === 0) {
      Swal.fire(
        "Advertencia",
        "No se encontraron correos electrónicos para los prospectos seleccionados.",
        "warning"
      );
      return;
    }

    if (!subject.trim() || !body.trim()) {
      Swal.fire(
        "Advertencia",
        "Por favor, complete el asunto y el cuerpo del correo.",
        "warning"
      );
      return;
    }

    try {
      const senderEmail = user?.correo || defaultSenderEmail;
      const requestBody = JSON.stringify({
        accion: "emails",
        name: user?.nombre || "",
        email: senderEmail,
        destinatarios: recipientEmails,
        motivo: subject,
        message: body,
      });

      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/mandarEmailsController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      const data = await response.json();

      if (data.status === "success" || data.status === "completed") {

            // ✅ Nuevo: Obtener la zona horaria del usuario
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const formattedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const registroPromises = selectedProspectIds.map((prospectoId, index) => {
            const actividadData = {
                funcion: "registrarActividad",
                prospecto_id: prospectoId,
                tipo_actividad: "email",
                detalle_actividad: `Correo enviado a ${recipientEmails[index]} con el asunto: ${subject}`,
                fecha_hora: formattedDateTime,
                zona_horaria: timeZone, // ✅ Agregamos la zona horaria
                estado_anterior: "Sin estado", 
                estado_nuevo: "Contacto iniciado",
                canal: "Email"
            };

            return fetch('https://apiweb.hitpoly.com/ajax/registerActividadController.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actividadData),
            }).then(res => res.json());
        });

        await Promise.all(registroPromises)
            .then(() => {
                })
            .catch(error => {
                });

        Swal.fire(
          "Éxito",
          "Los correos han sido enviados correctamente y la actividad registrada.",
          "success"
        ).then(() => {
          navigate(-1);
        });
      } else if (data.message?.includes("Invalid address:")) {
        Swal.fire(
          "Error",
          "La dirección de correo electrónico del remitente no es válida. Por favor, actualice su perfil con una dirección de correo electrónico válida.",
          "error"
        );
      } else if (data.error) {
        Swal.fire(
          "Error",
          `Hubo un problema al enviar los correos: ${data.error}`,
          "error"
        );
      } else {
        Swal.fire("Error", "Hubo un problema al enviar los correos.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudieron enviar los correos.", "error");
    }
  };

  return (
    <Layout title={"Enviar Emails"}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <h2>Enviar Correo a Prospectos Seleccionados</h2>
        <TextField
          label="Asunto"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Cuerpo del Correo"
          multiline
          rows={4}
          fullWidth
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleEnviarCorreo}
        >
          Enviar Correo a Seleccionados
        </Button>
        <Button onClick={() => navigate(-1)}>Cancelar</Button>
        {recipientEmails.length > 0 && (
          <p>
            Enviando correo a {recipientEmails.length} prospectos seleccionados.
          </p>
        )}
        {recipientEmails.length === 0 && selectedProspectIds.length > 0 && (
          <p>
            No se encontraron correos electrónicos para los prospectos
            seleccionados.
          </p>
        )}
        {!user?.id && <p>Cargando información del usuario...</p>}
        {selectedProspectIds.length === 0 && user?.id && (
          <p>No has seleccionado ningún prospecto.</p>
        )}
      </Stack>
    </Layout>
  );
}

export default EnviarCorreo;