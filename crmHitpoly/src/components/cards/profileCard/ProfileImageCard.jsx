import {
    Card,
    CardContent,
    Avatar,
    Box,
    CircularProgress,
    IconButton,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import { useState, useEffect } from "react";
  import { useAuth } from "../../../context/AuthContext";
  import axios from "axios";
  
  const ProfileImageCard = () => {
    const { user, login } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
    const [bannerUrl, setBannerUrl] = useState(user?.banner || "");
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      setAvatarUrl(user?.avatar || "");
      setBannerUrl(user?.banner || "");
    }, [user]);
  
    const handleImageUpload = async (e, type) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        setUploading(true);
        const res = await axios.post(
          "https://apisistemamembresia.hitpoly.com/ajax/Cloudinary.php",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        const url = res.data.url;
  
        if (type === "avatar") setAvatarUrl(url);
        else if (type === "banner") setBannerUrl(url);
  
        await fetch("https://apiweb.hitpoly.com/ajax/updateSetterController.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funcion: "update",
            id: user.id,
            ...(type === "avatar" && { avatar: url }),
            ...(type === "banner" && { banner: url }),
          }),
        });
  
        login({ ...user, [type]: url });
      } catch (err) {
        alert(`Error al subir ${type}`);
      } finally {
        setUploading(false);
      }
    };
  
    return (
      <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
        {/* Banner */}
        <Box sx={{ position: "relative", height: 280 }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: bannerUrl ? "transparent" : "#4f4f4f",
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
            disabled={uploading}
          >
            <EditIcon />
            <input hidden type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} />
          </IconButton>
        </Box>
  
        {/* Avatar alineado a la izquierda */}
        <CardContent sx={{ mt: -8, px: 3 }}>
          <Box display="flex" alignItems="center">
            <Box sx={{ position: "relative", mr: 2, "&:hover .edit": { opacity: 1 } }}>
              <Avatar
                src={avatarUrl}
                sx={{ width: 128, height: 128, border: "4px solid white" }}
              />
              <IconButton
                component="label"
                className="edit"
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                disabled={uploading}
              >
                <EditIcon />
                <input hidden type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
              </IconButton>
            </Box>
  
            {uploading && <CircularProgress size={24} />}
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default ProfileImageCard;
  