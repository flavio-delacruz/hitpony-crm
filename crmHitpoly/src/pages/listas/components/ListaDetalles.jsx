import React, { useContext, useState } from 'react';
import Layout from '../../../components/layout/layout';
import { Typography, Button } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProspectos } from '../../../context/ProspectosContext';
import ReusableTable from '../../../components/tables/userDataTable/ReusableTable';

const columns = [
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "apellido", headerName: "Apellido", width: 150 },
  { field: "celular", headerName: "Celular", width: 130 },
  { field: "correo", headerName: "Correo", width: 250 },
  { field: "estado_contacto", headerName: "Estado", width: 150 },
  { field: "ciudad", headerName: "Ciudad", width: 150 },
  { field: "sector", headerName: "Sector", width: 150 },
  { field: "productos_interes", headerName: "Intereses", width: 200 },
];

function ListaDetalles() {
  const { prospectos, loadingProspectos, errorProspectos } = useProspectos();
  const { nombreLista } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const listaSeleccionada = state?.listaSeleccionada;
  const [selectedProspectIds, setSelectedProspectIds] = useState([]);

  const filteredProspectos = listaSeleccionada?.prospectos
    ? prospectos.filter((prospecto) =>
        listaSeleccionada.prospectos.includes(String(prospecto.id))
      )
    : [];

  const handleRowSelectionChange = (newSelectionModel) => {
    setSelectedProspectIds(newSelectionModel);
  };

  const handleEnviarCorreoClick = () => {
    if (selectedProspectIds.length > 0) {
      navigate('/enviar-correo', { state: { selectedProspectIds } });
    } else {
      alert('Por favor, selecciona al menos un prospecto.');
    }
  };

  const handleRowClick = (params) => {
    const prospecto = params.row;
    if (prospecto && prospecto.id && prospecto.nombre && prospecto.apellido) {
      const slug = `${prospecto.nombre
        .toLowerCase()
        .replace(/\s+/g, "-")}-${prospecto.apellido
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigate(`/pagina-de-contacto/${slug}-${prospecto.id}`);
    } else {
      
    }
  };

  if (loadingProspectos) {
    return (
      <Layout title={`Detalles de la Lista: ${nombreLista}`}>
        <Typography>Cargando prospectos...</Typography>
      </Layout>
    );
  }

  if (errorProspectos) {
    return (
      <Layout title={`Detalles de la Lista: ${nombreLista}`}>
        <Typography color="error">{errorProspectos}</Typography>
      </Layout>
    );
  }

  return (
    <Layout title={`Detalles de la Lista: ${nombreLista}`}>
      <div style={{ width: '100%' }}>
        <ReusableTable
          rows={filteredProspectos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick} 
        />
        {selectedProspectIds.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnviarCorreoClick}
            sx={{ mt: 2 }}
          >
            Enviar Correo a Seleccionados
          </Button>
        )}
      </div>
    </Layout>
  );
}

export default ListaDetalles;