import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import CrmCard from "../../components/cards/crmCard/crmCard";

const CrmPage = () => {
  return (
    <Layout title={"Crm"}>
      <Box
        sx={{
          display: "grid",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <CrmCard />
      </Box>
    </Layout>
  );
};

export default CrmPage;
