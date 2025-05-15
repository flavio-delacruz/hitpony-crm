import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { useAuth } from "../../../../context/AuthContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #f0f0f0",
    boxShadow: 24,
    p: 4,
};

const CreateList = ({ open, onClose, onListCreated, prospectosSeleccionados }) => {
    const { user } = useAuth();
    const [listName, setListName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedProspectIds, setSelectedProspectIds] = useState([]);

    useEffect(() => {
        
        if (prospectosSeleccionados && prospectosSeleccionados.length > 0) {
            setSelectedProspectIds(prospectosSeleccionados);
        } else {
            
            const urlParams = new URLSearchParams(window.location.search);
            const prospectIds = urlParams.getAll('idProspecto');
            const prospectIdsNumericos = prospectIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            setSelectedProspectIds(prospectIdsNumericos);
        }
    }, [prospectosSeleccionados]); 

    const handleCreateList = async () => {
        if (!listName.trim()) {
            Swal.fire(
                "Advertencia",
                "Por favor, ingresa un nombre para la lista.",
                "warning"
            );
            return;
        }

        if (selectedProspectIds.length === 0) {
            Swal.fire(
                "Advertencia",
                "Por favor, selecciona al menos un prospecto.",
                "warning"
            );
            return;
        }

        setLoading(true);
        try {
            const requestBody = JSON.stringify({
                funcion: "registrarLista",
                nombre_lista: listName,
                link: "https://example.com",
                idSetter: user?.id,
                idProspecto: selectedProspectIds,
            });

            const response = await fetch(
                "https://apiweb.hitpoly.com/ajax/registerListaController.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: requestBody,
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }

            const text = await response.text();

            try {
                const data = JSON.parse(text);

                if (data.status === "success") {
                    Swal.fire(
                        "Éxito",
                        data.message || "La lista se ha creado correctamente.",
                        "success"
                    );
                    onListCreated();
                    onClose();
                } else {
                    Swal.fire(
                        "Error",
                        data.message || "No se pudo crear la lista.",
                        "error"
                    );
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error inesperado",
                    text: "La respuesta del servidor no es válida. Contacta al equipo técnico.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error inesperado",
                text: "Ocurrió un error al intentar crear la lista: " + error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="create-list-modal-title"
            aria-describedby="create-list-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="create-list-modal-title"
                    variant="h6"
                    component="h2"
                >
                    Crear Nueva Lista
                </Typography>
                <TextField
                    label="Nombre de la Lista"
                    fullWidth
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    margin="normal"
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateList}
                    sx={{ mt: 2, mr: 2 }}
                    disabled={loading}
                >
                    {loading ? "Creando..." : "Crear Lista"}
                </Button>
                <Button onClick={onClose} sx={{ mt: 2 }} disabled={loading}>
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateList;
