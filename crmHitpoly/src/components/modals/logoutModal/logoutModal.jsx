import { Button, Modal, Box, Typography } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";

const LogoutModal = ({ open, handleClose }) => {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout();       
    handleClose();  
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          mb={2}
        >
          ¿Estás seguro de salir?
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={3}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmLogout}
          >
            Salir
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
