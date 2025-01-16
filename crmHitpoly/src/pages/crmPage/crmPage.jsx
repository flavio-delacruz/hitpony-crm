import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import CrmCard from "../../components/cards/crmCard/crmCard";

const CrmPage = () => {
  return (
    <Layout title={"Crm"}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          padding={2}
        >
          <CrmCard />
        </Box>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          padding={2}
        >
          <CrmCard />
        </Box>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          padding={2}
        >
          <CrmCard />
        </Box>
      </Box>
    </Layout>
  );
};

export default CrmPage;
