import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";

const CloserSetterCard = ({
  setter,
  selectedClosers,
  closersAsignados,
  handleCloserChange,
  getContacto,
  handleOpenCorreo,
}) => {
  return (
    <Card raised>
      <Box
        sx={{
          position: "relative",
          height: 150,
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${setter.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      />
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: -5,
            ml: 2,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "4px solid white",
            backgroundColor: "grey.300",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {setter.avatar ? (
            <img
              src={setter.avatar}
              alt={`Foto de perfil de ${setter.nombre}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <PersonIcon sx={{ fontSize: 60, color: "grey.600" }} />
          )}
        </Box>
        <CardContent sx={{ ml: 2, position: "relative" }}>
          <Typography variant="h6">
            {setter.nombre} {setter.apellido}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ mr: 1 }}>
              Setter
            </Typography>
            <IconButton
              aria-label="contactar por correo"
              onClick={() => handleOpenCorreo(setter.id)}
              sx={{
                color: "primary.main",
                p: 0.5,
              }}
            >
              <MailOutlineIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 1, overflowWrap: "break-word" }}
          >
            Correo: {setter.correo}
          </Typography>
          <Typography variant="body2">
            Teléfono: {setter.telefono}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Closers asignados:
            </Typography>
            {selectedClosers[setter.id] &&
            selectedClosers[setter.id].length > 0 ? (
              selectedClosers[setter.id].map((closerId) => {
                const closer = getContacto(closerId);
                return (
                  closer && (
                    <Typography key={closerId} variant="body2">
                      - {closer.nombre} {closer.apellido}
                    </Typography>
                  )
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay closers asignados.
              </Typography>
            )}
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Select
                multiple
                value={selectedClosers[setter.id] || []}
                onChange={(event) =>
                  handleCloserChange(setter.id, event)
                }
                input={<OutlinedInput />}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Relacionar Closer</em>;
                  }
                  return "Relacionar Closer";
                }}
              >
                <MenuItem disabled value="">
                  <em>Relacionar Closer</em>
                </MenuItem>
                {closersAsignados.map((closer) => (
                  <MenuItem key={closer.id} value={closer.id.toString()}>
                    <Checkbox
                      checked={(selectedClosers[setter.id] || []).includes(
                        closer.id.toString()
                      )}
                    />
                    <ListItemText
                      primary={`${closer.nombre} ${closer.apellido}`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default CloserSetterCard;