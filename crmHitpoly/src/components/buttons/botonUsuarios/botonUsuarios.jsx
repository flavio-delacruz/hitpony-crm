import Button from "@mui/material/Button";

const BotonUsuarios = ({ text, icon: Icon, backgroundColor }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: backgroundColor || "#BA000D",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      size="small"
    >
      {text}
      {Icon && <Icon sx={{ marginLeft: 1 }} />}
    </Button>
  );
};

export default BotonUsuarios;
