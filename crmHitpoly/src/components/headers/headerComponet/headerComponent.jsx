import { Box, Typography, IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SearchRounded } from "@mui/icons-material";

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "20px",
});

const HeaderComponent = () => {
  return (
    <Header>
      <Typography
        sx={{ fontWeight: "bold", color: "#000" }}
        variant="h6"
      >
        Pages / Dashboard
      </Typography>
      <Box
        display="flex"
        alignItems="center"
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            padding: "5px 10px",
            borderRadius: "10px",
            marginRight: "10px",
          }}
        >
          <InputBase placeholder="Search..." />
          <SearchRounded />
        </Box>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <SettingsIcon />
        </IconButton>
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </Header>
  );
};

export default HeaderComponent;
