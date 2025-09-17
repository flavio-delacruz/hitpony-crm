import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import MisAsignacionesAdmin from "./grillaUsuarios/MisAsignacionesAdmin";
import MisAsignacionesCliente from "./grillaUsuarios/MisAsignacionesCliente";
import MisAsignacionesCloser from "./grillaUsuarios/MisAsignacionesCloser";
import MisAsignacionesSetter from "./grillaUsuarios/MisAsignacionesSetter";
import CorreoFlotanteUsuarios from "../../components/correos/enviados/CorreoFlotanteUsuarios";
import Layout from "../../components/layout/layout";

const ENDPOINT_GET_USERS =
  "https://apiweb.hitpoly.com/ajax/traerUsuariosController.php";
const ENDPOINT_CLIENTE_ASIGNACIONES =
  "https://apiweb.hitpoly.com/ajax/getCloserClientesController.php";
const ENDPOINT_TRAER_ASIGNACIONES =
  "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php";
const userTypesMap = {
  1: "Administrador",
  2: "Setter",
  3: "Closer",
  4: "Cliente",
};

const MisAsignacionesContainer = () => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]); // Inicializado como array vacío
  const [asignacionesCloserSetter, setAsignacionesCloserSetter] = useState([]); // Inicializado como array vacío
  const [openCorreoFlotante, setOpenCorreoFlotante] = useState(false);
  const [contactoParaCorreo, setContactoParaCorreo] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const fetchDatos = useCallback(async () => {
    if (!user || !user.id || ![1, 2, 3, 4].includes(user.id_tipo)) {
      setError(
        "Acceso denegado: Este componente es solo para usuarios con roles definidos."
      );
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const [usuariosRes, asignacionesRes, asignacionesCloserSetterRes] = await Promise.all([
        fetch(ENDPOINT_GET_USERS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "getDataUsuarios" }),
        }),
        fetch(ENDPOINT_CLIENTE_ASIGNACIONES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        }),
        fetch(ENDPOINT_TRAER_ASIGNACIONES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "get" }),
        }),
      ]);

      const usuariosData = await usuariosRes.json();
      const asignacionesData = await asignacionesRes.json();
      const asignacionesCloserSetterData = await asignacionesCloserSetterRes.json();

      if (usuariosData.success) {
        setContactos(usuariosData.data);
      } else {
        throw new Error("Error al obtener los usuarios.");
      }
      if (asignacionesData.success) {
        setAsignaciones(asignacionesData["Clientes-closers-setters"] || []);
      } else {
        throw new Error("Error al obtener las asignaciones de clientes.");
      }
      if (asignacionesCloserSetterData.success) {
        setAsignacionesCloserSetter(asignacionesCloserSetterData.data || []);
      } else {
        throw new Error("Error al obtener las asignaciones de closer/setter.");
      }
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const onAsignacionExitosa = useCallback(() => {
    fetchDatos();
  }, [fetchDatos]);

  const getContacto = (id) => {
    return contactos.find((contacto) => contacto.id.toString() === id.toString());
  };

  const handleOpenCorreo = (id) => {
    setContactoParaCorreo(id);
    setOpenCorreoFlotante(true);
  };

  const handleCloseCorreo = () => {
    setOpenCorreoFlotante(false);
    setContactoParaCorreo(null);
  };

  if (cargando) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  const commonProps = {
    user,
    contactos,
    asignaciones,
    asignacionesCloserSetter,
    getContacto,
    handleOpenCorreo,
    userTypesMap,
    searchInput,
    setSearchInput,
    onAsignacionExitosa,
  };

  switch (user.id_tipo) {
    case 1:
      return (
        <Layout>
          <MisAsignacionesAdmin {...commonProps} />
          <CorreoFlotanteUsuarios open={openCorreoFlotante} onClose={handleCloseCorreo} usuarioId={contactoParaCorreo} />
        </Layout>
      );
    case 4:
      return (
        <Layout>
          <MisAsignacionesCliente {...commonProps} />
          <CorreoFlotanteUsuarios open={openCorreoFlotante} onClose={handleCloseCorreo} usuarioId={contactoParaCorreo} />
        </Layout>
      );
    case 3:
      return (
        <Layout>
          <MisAsignacionesCloser {...commonProps} />
          <CorreoFlotanteUsuarios open={openCorreoFlotante} onClose={handleCloseCorreo} usuarioId={contactoParaCorreo} />
        </Layout>
      );
    case 2:
      return (
        <Layout>
          <MisAsignacionesSetter {...commonProps} />
          <CorreoFlotanteUsuarios open={openCorreoFlotante} onClose={handleCloseCorreo} usuarioId={contactoParaCorreo} />
        </Layout>
      );
    default:
      return null;
  }
};

export default MisAsignacionesContainer;