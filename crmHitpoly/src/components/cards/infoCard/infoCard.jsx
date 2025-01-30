import { Grid, Typography, Card } from "@mui/material";
import { styled } from "@mui/system";

const CardStyled = styled(Card)({
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const InfoCard = ({
  title,
  amount,
  percentage,
  percentageColor = "textSecondary",
}) => {
  return (
    <Grid
      item
      xs={3}
    >
      <CardStyled sx={{ padding: { xs: "10px", sm: "20px" }, height: "100%" }}>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem" } }}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="h4"
          color="primary"
        >
          {amount}
        </Typography>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="body2"
          color={percentageColor}
        >
          {percentage}
        </Typography>
      </CardStyled>
    </Grid>
  );
};

export default InfoCard;
