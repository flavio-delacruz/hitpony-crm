import { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import DataTable from "../../components/tables/userDataTable/userDataTable";

const UserListPage = () => {

  return (
    <Layout title={"Usuarios"}>
      <Box sx={{ padding: "0" }}>
        <DataTable />
      </Box>
    </Layout>
  );
};

export default UserListPage;
