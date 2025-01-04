import { Box } from "@mui/material";
import { styled } from "@mui/system";
import SideBar from "../sideBar/sideBar";
import HeaderComponent from "../headers/headerComponet/headerComponent";

const MainContent = styled(Box)({
  flex: 1,
  padding: "20px",
});

const Layout = ({ children }) => {
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
        <HeaderComponent />
        {/* contenido de la pagina */}
        {children}
      </MainContent>
    </Box>
  );
};

export default Layout;
