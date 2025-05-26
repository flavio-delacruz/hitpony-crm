import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import Layout from "../../layout/layout"; // Asegúrate de la ruta correcta
import { useAuth } from "../../../context/AuthContext";
// Importa useAdminDashboardData directamente aquí
import useAdminDashboardData from "../../../pages/admin/components/useAdminDashboardData";

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

  // IMPORTANTE: Utiliza useAdminDashboardData aquí para acceder a los datos cargados.
  // Esto es seguro porque useAdminDashboardData ya maneja su propia caché y carga.
  const { data: allProspectsData, getProspectsDataFromLoadedData } = useAdminDashboardData();

  useEffect(() => {
    const loadProspectEmails = () => {
      setLoadingEmails(true);
      console.log("EnviarCorreoAdmin: IDs de prospectos recibidos:", selectedProspectIds);

      if (selectedProspectIds.length > 0 && allProspectsData.length > 0 && typeof getProspectsDataFromLoadedData === 'function') {
        // Usa la función del hook para filtrar los prospectos de los datos ya cargados
        const prospectsData = getProspectsDataFromLoadedData(selectedProspectIds);
        console.log("EnviarCorreoAdmin: Datos de prospectos obtenidos de useAdminDashboardData:", prospectsData);

        const emails = prospectsData
          .map((prospecto) => prospecto.correo || prospecto.email)
          .filter((email) => email && email.trim() !== "");

        setRecipientEmails(emails);

        if (emails.length === 0 && prospectsData.length > 0) {
          Swal.fire(
            "Advertencia",
            "Algunos prospectos seleccionados no tienen una dirección de correo electrónico válida.",
            "warning"
          );
        }
      } else if (selectedProspectIds.length === 0) {
          setRecipientEmails([]);
      } else {
          // Si no hay datos cargados aún, es posible que el hook todavía esté en proceso
          // Podrías mostrar un spinner aquí si es necesario
          console.log("Esperando que useAdminDashboardData cargue los datos...");
          // No hacemos nada hasta que allProspectsData tenga datos
      }
      // Solo establece loadingEmails en false cuando el proceso de búsqueda ha terminado
      // y tenemos datos (o sabemos que no hay)
      if (selectedProspectIds.length === 0 || (allProspectsData.length > 0 && typeof getProspectsDataFromLoadedData === 'function')) {
          setLoadingEmails(false);
      }
    };

    // Esto se ejecutará cada vez que selectedProspectIds cambie o allProspectsData cambie
    // (lo cual sucederá cuando useAdminDashboardData termine de cargar/actualizar)
    loadProspectEmails();
  }, [selectedProspectIds, allProspectsData, getProspectsDataFromLoadedData]);


  const handleEnviarCorreo = async () => {
    // ... (Tu lógica existente para enviar correos, no cambia)
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
      const senderEmail = user?.correo || defaultSenderEmail;
      const requestBody = JSON.stringify({
        accion: "emails",
        name: user?.nombre || "Administrador",
        email: senderEmail,
        destinatarios: recipientEmails,
        motivo: subject,
        message: body,
      });

      console.log("Cuerpo de la solicitud para enviar correo:", requestBody);

      const response = await fetch(
        "https://apiweb.hitpoly.com/ajax/mandarEmailsController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      const data = await response.json();
      console.log("Respuesta de la API de envío de correos:", data);

      if (data.status === "success") {
        Swal.fire(
          "Éxito",
          `Los correos a ${recipientEmails.length} prospectos han sido enviados correctamente.`,
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
      console.error("Error al enviar correos:", error);
      Swal.fire("Error", "No se pudieron enviar los correos.", "error");
    }
  };

  return (
    <Layout title={"Enviar Emails a Administrador"}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <h2>Enviar Correo a Prospectos Seleccionados (Admin)</h2>
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

            {/* Mensajes de estado */}
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