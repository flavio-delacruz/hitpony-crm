import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton, Grid, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";  
import { useAuth } from "../../../context/AuthContext";
import { formsList } from "./formsList"; 

const ShareLinkModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [copiedLink, setCopiedLink] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (user?.id) {
      
      const generatedLinks = formsList.map((form) => ({
        name: form.titulo,
        link: `${window.location.origin}/registros/${form.name}?idSetter=${user.id}`,
      }));
      
      setLinks(generatedLinks);  
    }
  }, [user]);

  const copiarAlPortapapeles = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);  
    setOpenAlert(true); 

    
    onClose();
  };

  const handleCloseAlert = () => {
    setOpenAlert(false); 
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom sx={{marginBottom: 4}}> 
            Formularios para el cliente
          </Typography>

          <Grid container spacing={2}>
            {links.map((linkObj, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    "&:hover": { boxShadow: 3, cursor: "pointer" },
                  }}
                >
                  <Typography variant="body1">{linkObj.name}</Typography>
                  <IconButton onClick={() => copiarAlPortapapeles(linkObj.link)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for custom alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{
            backgroundColor: "white",
            color: "black",
            width: "100%",
            borderRadius: 1,
            fontWeight: 'bold',
          }}
        >
          ¡Enlace copiado al portapapeles!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareLinkModal;
