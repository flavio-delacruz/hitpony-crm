import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import Layout from "../../layout/layout";
import { useAuth } from "../../../context/AuthContext";
import useAdminDashboardData from "../../../pages/admin/components/useAdminDashboardData";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function EnviarCorreoAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProspectIds } = location.state || { selectedProspectIds: [] };
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const { user } = useAuth();
  const defaultSenderEmail = "no-reply@hitpoly.com";
  const senderEmail = user?.correo || defaultSenderEmail;

  useEffect(() => {}, [user, senderEmail]);

  const { data: allProspectsData, getProspectsDataFromLoadedData } =
    useAdminDashboardData();

  useEffect(() => {
    const loadProspectEmails = () => {
      setLoadingEmails(true);
      if (
        selectedProspectIds.length > 0 &&
        allProspectsData.length > 0 &&
        typeof getProspectsDataFromLoadedData === "function"
      ) {
        const prospectsData =
          getProspectsDataFromLoadedData(selectedProspectIds);
        const emails = prospectsData
          .map((prospecto) => prospecto.correo || prospecto.email)
          .filter(
            (email) => email && email.trim() !== "" && EMAIL_REGEX.test(email)
          );

        setRecipientEmails(emails);

        if (emails.length === 0 && prospectsData.length > 0) {
          Swal.fire(
            "Advertencia",
            "Algunos prospectos seleccionados no tienen una dirección de correo electrónico válida o con el formato correcto.",
            "warning"
          );
        } else if (emails.length < selectedProspectIds.length) {
          const invalidCount = selectedProspectIds.length - emails.length;
          Swal.fire(
            "Advertencia",
            `Se encontraron ${invalidCount} prospectos con direcciones de correo inválidas o vacías. Solo se enviará a las direcciones válidas.`,
            "warning"
          );
        }
      } else if (selectedProspectIds.length === 0) {
        setRecipientEmails([]);
      } else {
      }

      if (
        selectedProspectIds.length === 0 ||
        (allProspectsData.length > 0 &&
          typeof getProspectsDataFromLoadedData === "function")
      ) {
        setLoadingEmails(false);
      }
    };

    loadProspectEmails();
  }, [selectedProspectIds, allProspectsData, getProspectsDataFromLoadedData]);

  const handleEnviarCorreo = async () => {
    if (recipientEmails.length === 0) {
      Swal.fire(
        "Advertencia",
        "No se encontraron correos electrónicos válidos para los prospectos seleccionados. No se enviará ningún correo.",
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
      const requestBody = JSON.stringify({
        accion: "emails",
        name: user?.nombre || "Usuario",
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
        Swal.fire(
          "Éxito",
          `Los correos a ${recipientEmails.length} prospectos han sido enviados correctamente.`,
          "success"
        ).then(() => {
          navigate(-1);
        });
      } else if (data.message?.includes("Invalid address:")) {
        let errorMessage = "Una dirección de correo electrónico no es válida.";
        if (data.message.includes("(to):")) {
          errorMessage = `Una dirección de correo de destinatario es inválida: "${data.message
            .split("(to):")[1]
            .trim()}"`;
        } else if (data.message.includes("(from):")) {
          errorMessage = `La dirección de correo electrónico del remitente es inválida: "${senderEmail}". Por favor, contacte al soporte o verifique su perfil.`;
        }

        Swal.fire("Error", errorMessage, "error");
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
        {loadingEmails ? (
          <p>Cargando correos de prospectos...</p>
        ) : (
          <>
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
              disabled={
                recipientEmails.length === 0 || !subject.trim() || !body.trim()
              }
            >
              Enviar Correo a {recipientEmails.length} Prospecto(s)
            </Button>
            <Button onClick={() => navigate(-1)}>Cancelar</Button>

            {selectedProspectIds.length > 0 && recipientEmails.length > 0 && (
              <p>
                Se enviará correo a **{recipientEmails.length}** prospecto(s)
                seleccionado(s).
                {selectedProspectIds.length > recipientEmails.length &&
                  ` (${
                    selectedProspectIds.length - recipientEmails.length
                  } prospectos no tenían correo válido o se omitieron)`}
              </p>
            )}
            {selectedProspectIds.length > 0 && recipientEmails.length === 0 && (
              <p>
                No se encontraron correos electrónicos válidos para los **
                {selectedProspectIds.length}** prospectos seleccionados.
              </p>
            )}
            {selectedProspectIds.length === 0 && (
              <p>No has seleccionado ningún prospecto.</p>
            )}
            {!user?.id && selectedProspectIds.length > 0 && (
              <p>Cargando información del usuario...</p>
            )}
          </>
        )}
      </Stack>
    </Layout>
  );
}

export default EnviarCorreoAdmin;
