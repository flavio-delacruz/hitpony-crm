import { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import UserListHeader from "../../components/headers/userListHeader/userListHeader";
import DataTable from "../../components/tables/userDataTable/userDataTable";
import AddModal from "../../components/modals/addModal/addModal";

const UserListPage = () => {
  const [users, setUsers] = useState([
    // Datos iniciales de ejemplo
    {
      nombre: "Juan",
      apellidos: "Pérez",
      correo: "juan.perez@example.com",
      telefono: "123456789",
      direccion: "Calle 1",
    },
    {
      nombre: "María",
      apellidos: "López",
      correo: "maria.lopez@example.com",
      telefono: "987654321",
      direccion: "Avenida 2",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleSaveUser = (newUser) => {
    setUsers([...users, newUser]);
    setIsModalOpen(false);
  };

  return (
    <Layout title={"Usuarios"}>
      <Box sx={{ padding: "0" }}>
        <UserListHeader
          onAddNew={handleAddNew}
          onShareForm={() => console.log("Compartir Formulario clickeado")}
        />

        {/* Tabla */}
        <DataTable />
      </Box>
      <AddModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </Layout>
  );
};

export default UserListPage;
