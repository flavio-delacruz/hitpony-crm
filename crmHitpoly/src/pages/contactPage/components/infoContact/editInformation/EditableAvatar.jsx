import { Avatar, Box, IconButton, CircularProgress } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Icono de la cámara
import { useState, useEffect } from "react";
import axios from "axios";

const EditableAvatar = ({ contactData, onAvatarChange }) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const localAvatar = localStorage.getItem(`avatar-${contactData.id}`);
    if (localAvatar) {
      setAvatarUrl(localAvatar);
    } else if (contactData.avatar) {
      setAvatarUrl(contactData.avatar);
    }
  }, [contactData]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      // 1. Subir imagen a Cloudinary
      const res = await axios.post(
        "https://apisistemamembresia.hitpoly.com/ajax/Cloudinary.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const url = res.data.url;

      await fetch(
        "https://apiweb.hitpoly.com/ajax/updateProspectoController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            id: contactData.id,
            foto_perfil: url,
          }),
        }
      );

      setAvatarUrl(url);
      localStorage.setItem(`avatar-${contactData.id}`, url);

      if (onAvatarChange) onAvatarChange(url);

    } catch (err) {
      alert("Error al subir avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        "&:hover .edit": { opacity: 1 },
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          borderRadius: "50%", 
          boxShadow: "none", 
        }}
      >
        <Avatar
          src={avatarUrl}
          className="avatar"
          sx={{
            width: 60,
            height: 60,
            mb: 1,
            border: "2px solid white",
            position: "relative",
            transition: "box-shadow 0.3s", 
          }}
        >
          {contactData.nombre?.charAt(0) || "D"}
        </Avatar>

        <Box
          className="overlay"
          sx={{
            position: "absolute",
            width: 60,
            height: 60,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            opacity: 0,
            transition: "opacity 0.3s",
            zIndex: 1, 
          }}
        />

        <IconButton
          component="label"
          className="edit"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "transparent",
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s",
            zIndex: 2,
            borderRadius: "50%",
            p: 1, 
            "&:hover": {
              opacity: 1, 
            },
          }}
          disabled={uploading}
        >
          <CameraAltIcon fontSize="small" />
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </IconButton>
      </Box>

      {uploading && (
        <CircularProgress
          size={24}
          sx={{ position: "absolute", top: 15, left: 15, zIndex: 2 }}
        />
      )}
    </Box>
  );
};

export default EditableAvatar;
