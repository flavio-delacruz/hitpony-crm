import { Grid, Typography, Card } from "@mui/material";
import { styled } from "@mui/system";

const CardStyled = styled(Card)({
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const ContentCard = ({ title, subtitle, children, gridSize = 8 }) => {
  return (
    <Grid
      item
      xs={gridSize}
    >
      <CardStyled
        sx={{
          padding: { xs: "10px", sm: "20px" },
          width: { xs: "90vw", sm: "100%" },
          height: "100%",
        }}
      >
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="body2"
          color="textSecondary"
        >
          {subtitle}
        </Typography>
        {children}
      </CardStyled>
    </Grid>
  );
};

export default ContentCard;
