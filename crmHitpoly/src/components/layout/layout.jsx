import { Box } from "@mui/material";
import { styled } from "@mui/system";
import SideBar from "../sideBar/sideBar";
import HeaderComponent from "../headers/headerComponet/usuarios/headerComponent";
import { useMediaQuery } from "@mui/material";
import HeaderComponentMovile from "../headers/headerComponet/usuarios/headerComponentMovile";

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: "20px",
  height: "100vh",
  overflow: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
  },
}));

const Layout = ({ children, title }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
      }}
    >
      <SideBar />
      <MainContent>
        {isMobile ? <HeaderComponentMovile /> : <HeaderComponent />}
        {children}
      </MainContent>
    </Box>
  );
};

export default Layout;