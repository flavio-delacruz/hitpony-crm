import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import UserListHeader from "../../components/headers/userListHeader/userListHeader";
import DataTable from "../../components/tables/userDataTable/userDataTable";

const UserListPage = () => {
  const handleAddNew = () => {
    console.log("Agregar Nuevo clickeado");
  };

  const handleShareForm = () => {
    console.log("Compartir Formulario clickeado");
  };

  return (
    <Layout>
      <Box sx={{ padding: "0" }}>
        <UserListHeader
          pageName="Lista de Usuarios"
          userCount={25}
          onAddNew={handleAddNew}
          onShareForm={handleShareForm}
        />

        {/* Tabla */}
        <DataTable />
      </Box>
    </Layout>
  );
};

export default UserListPage;
