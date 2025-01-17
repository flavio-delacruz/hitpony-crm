import { Grid, Typography, Card } from "@mui/material";
import { styled } from "@mui/system";
import BarChart from "../../barChart/barChart";

const CardStyled = styled(Card)({
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const ChartCard = ({
  series,
  xAxis,
  height = 290,
  title,
  titleChart,
  subtitle,
  margin = { top: 10, bottom: 30, left: 40, right: 10 },
}) => {
  return (
    <Grid
      item
      xs={4}
    >
      <CardStyled>
        <BarChart
          titleChart={titleChart}
          series={series}
          height={height}
          xAxis={xAxis}
          margin={margin}
        />
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
      </CardStyled>
    </Grid>
  );
};

export default ChartCard;
