import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Layout from "../../components/layout/layout";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TraerListas from "./components/TraerListas";
import EditarLista from "./components/EditarLista";
import EliminarLista from "./components/EliminarLista";
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment/locale/es';
// Importa el nuevo hook
import { useProspectos } from '../../context/ProspectosContext';

function Listas() {
    const { user } = useAuth();
    const [userLists, setUserLists] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Usa el hook para obtener los prospectos y el estado de carga
    const { prospectos: allUserProspects, loadingProspectos } = useProspectos();

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentList, setCurrentList] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        moment.locale('es');
    }, []);

    const handleNombreGuardado = (listId, nuevoNombre) => {
        setUserLists((currentLists) =>
            currentLists.map((list) =>
                list.id === listId ? { ...list, nombre_lista: nuevoNombre } : list
            )
        );
        setEditingId(null);
        handleCloseMenu();
    };

    const handleEditarNombre = (list) => {
        setEditingId(list.id);
        handleCloseMenu();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleListaEliminada = (listId) => {
        setUserLists((currentLists) =>
            currentLists.filter((list) => list.id !== listId)
        );
        handleCloseMenu();
    };

    const getContactosCount = (list) => {
        if (!list.prospectos || !Array.isArray(list.prospectos) || !allUserProspects) {
            return 0;
        }
        const listProspectIds = new Set(list.prospectos.map(String));
        const count = allUserProspects.filter(prospecto =>
            listProspectIds.has(String(prospecto.id))
        ).length;
        return count;
    };

    const generarUrlAmigable = (nombre, id) => {
        return `${nombre.toLowerCase().replace(/ /g, '-')}-${id}`;
    };

    const handleOpenMenu = (event, list) => {
        setAnchorEl(event.currentTarget);
        setCurrentList(list);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setCurrentList(null);
    };

    return (
        <Layout title={"Listas"}>
            <Paper sx={{ p: 2, mt: 2, borderRadius: "15px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Listas de Prospectos
                    </Typography>
                </div>

                <TraerListas setListas={setUserLists} />

                {loadingProspectos && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>Cargando prospectos...</Typography>
                    </div>
                )}

                {!loadingProspectos && userLists.length > 0 ? (
                    <TableContainer component={Paper} elevation={0}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell align="center">Tamaño</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userLists.map((list) => (
                                    <TableRow key={list.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {editingId === list.id ? (
                                            <TableCell colSpan={3}>
                                                <EditarLista
                                                    lista={list}
                                                    onNombreGuardado={handleNombreGuardado}
                                                    onCancelEdit={handleCancelEdit}
                                                />
                                            </TableCell>
                                        ) : (
                                            <>
                                                <TableCell component="th" scope="row">
                                                    <Link
                                                        to={`/listas/${generarUrlAmigable(list.nombre_lista, list.id)}`}
                                                        state={{ listaSeleccionada: list }}
                                                        style={{
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#4285F4';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'inherit';
                                                        }}
                                                    >
                                                        {list.nombre_lista}
                                                    </Link>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="center">{getContactosCount(list)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        aria-label="más"
                                                        onClick={(event) => handleOpenMenu(event, list)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : !loadingProspectos && (
                    <Typography color="textSecondary">No hay listas disponibles.</Typography>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={() => handleEditarNombre(currentList)}>
                        <EditIcon sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    <EliminarLista
                        listaId={currentList?.id}
                        onListaEliminada={handleListaEliminada}
                        onCloseMenu={handleCloseMenu}
                    />
                </Menu>

            </Paper>
            <Outlet />
        </Layout>
    );
}

export default Listas;