import { Grid, Typography, Card } from "@mui/material";
import { styled } from "@mui/system";

const CardStyled = styled(Card)({
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const ContentCard = ({ title, subtitle, children, gridSize = 8 }) => {
  return (
    <Grid
      item
      xs={gridSize}
    >
      <CardStyled>
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
