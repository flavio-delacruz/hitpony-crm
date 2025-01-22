import { Box } from "@mui/material";
import { styled } from "@mui/system";
import SideBar from "../sideBar/sideBar";
import HeaderComponent from "../headers/headerComponet/headerComponent";
import { useMediaQuery } from "@mui/material";
import HeaderComponentMovile from "../headers/headerComponet/headerComponentMovile";

const MainContent = styled(Box)({
  flex: 1,
  padding: "20px",
  height: "100vh",
  overflow: "auto",
});

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
        {isMobile ? (
          <HeaderComponentMovile title={title} />
        ) : (
          <HeaderComponent title={title} />
        )}

        {children}
      </MainContent>
    </Box>
  );
};

export default Layout;
