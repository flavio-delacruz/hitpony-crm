import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const ProfileCard = () => {
  return (
    <Card
      sx={{
        padding: "20px",
        borderRadius: "15px",
        height: "100%",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardHeader
        title="Edit Profile"
        action={
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Settings
          </Button>
        }
        sx={{ borderBottom: 1, borderColor: "divider", pb: 0 }}
      />
      <CardContent>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          User Information
        </Typography>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Username"
              defaultValue="lucky.jesse"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Email address"
              defaultValue="jesse@example.com"
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="First name"
              defaultValue="Jesse"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Last name"
              defaultValue="Lucky"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          Contact Information
        </Typography>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Address"
              defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="City"
              defaultValue="New York"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="Country"
              defaultValue="United States"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              label="Postal code"
              defaultValue="437300"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", opacity: 0.7, mb: 2 }}
        >
          About me
        </Typography>
        <TextField
          fullWidth
          label="About me"
          defaultValue="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."
          variant="outlined"
          multiline
          rows={3}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
