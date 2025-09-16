import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Layout from "../../components/layout/layout";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { blueGrey } from "@mui/material/colors";
import TraerListas from "./components/TraerListas";
import EditarLista from "./components/EditarLista";
import EliminarLista from "./components/EliminarLista";
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment/locale/es';

function Listas() {
    const { user } = useAuth();
    const [userLists, setUserLists] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [allUserProspects, setAllUserProspects] = useState([]);
    const [loadingProspects, setLoadingProspects] = useState(true);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentList, setCurrentList] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        moment.locale('es');
    }, []);

    const checkAndUpdateProspects = useCallback(async () => {
        if (!user?.id || !user?.id_tipo) {
            setLoadingProspects(false);
            return;
        }

        const cachedCount = localStorage.getItem('prospectosCount');
        const cachedProspectsString = localStorage.getItem('allUserProspects');
        
        if (cachedProspectsString && cachedCount) {
            setAllUserProspects(JSON.parse(cachedProspectsString));
            }
        
        setLoadingProspects(true);
        try {
            let finalProspects = [];
            const { id, id_tipo } = user;
            
            const userType = Number(id_tipo);

            if (userType === 3) {
                console.log('🔍 Intentando traer asignaciones para el tipo de usuario 3...');
                const asignacionesResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accion: "get" }),
                });
                
                if (!asignacionesResponse.ok) {
                    throw new Error(`Error HTTP: ${asignacionesResponse.status}`);
                }
                
                const asignacionesData = await asignacionesResponse.json();
                
                const asignacionDelCloser = asignacionesData.data.find(asignacion => Number(asignacion.id_closer) === Number(id));
                let setterIds = [];
                if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
                    try {
                        const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
                        if (Array.isArray(parsedSetters)) {
                            setterIds = parsedSetters;
                        }
                        } catch (e) {
                        throw new Error('Formato de IDs de setters inválido.');
                    }
                }

                const promises = setterIds.map(setterId =>
                    fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
                    }).then(res => {
                        if (!res.ok) throw new Error(`Error HTTP en prospectos de setter: ${res.status}`);
                        return res.json();
                    })
                );
                
                const allProspectsFromSetters = await Promise.all(promises);
                const prospectsFromSetters = allProspectsFromSetters.flatMap(data => data.resultado || []);
                finalProspects.push(...prospectsFromSetters);
                } else if (userType === 4) {
                const asignacionesResponse = await fetch("https://apiweb.hitpoly.com/ajax/getCloserClientesController.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accion: "get", cliente_id: id }),
                });

                if (!asignacionesResponse.ok) {
                    throw new Error(`Error HTTP: ${asignacionesResponse.status}`);
                }

                const asignacionesData = await asignacionesResponse.json();
                
                let setterIds = [];
                if (asignacionesData.success && asignacionesData["Clientes-closers-setters"] && asignacionesData["Clientes-closers-setters"].length > 0) {
                    const asignacionDelCliente = asignacionesData["Clientes-closers-setters"].find(asignacion => Number(asignacion.cliente_id) === Number(id));
                    if (asignacionDelCliente && asignacionDelCliente.setters_ids) {
                        setterIds = asignacionDelCliente.setters_ids;
                    }
                }

                if (setterIds.length > 0) {
                    const promises = setterIds.map(setterId =>
                        fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
                        }).then(res => {
                            if (!res.ok) throw new Error(`Error HTTP en prospectos de setter: ${res.status}`);
                            return res.json();
                        })
                    );
                    
                    const allProspectsFromSetters = await Promise.all(promises);
                    const prospectsFromSetters = allProspectsFromSetters.flatMap(data => data.resultado || []);
                    finalProspects.push(...prospectsFromSetters);
                    }
            }

            const userProspectsResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ funcion: "getProspectos", id: id }),
            });

            if (!userProspectsResponse.ok) {
                throw new Error(`Error HTTP en prospectos de usuario: ${userProspectsResponse.status}`);
            }

            const userProspectsData = await userProspectsResponse.json();
            finalProspects.push(...(userProspectsData.resultado || []));
            
            const uniqueProspects = Array.from(new Map(finalProspects.map(p => [p.id, p])).values());
            const formattedProspects = uniqueProspects.map(item => ({ id: item.id, ...item }));
            
            const newCount = formattedProspects.length;

            if (parseInt(cachedCount) !== newCount) {
                setAllUserProspects(formattedProspects);
                localStorage.setItem('prospectosCount', newCount);
                localStorage.setItem('allUserProspects', JSON.stringify(formattedProspects));
                } else {
                }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Sincronización',
                text: 'Hubo un problema al obtener los prospectos. Intenta recargar la página.',
            });
        } finally {
            setLoadingProspects(false);
        }
    }, [user]);

    useEffect(() => {
        checkAndUpdateProspects();
    }, [user, checkAndUpdateProspects]);

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
        if (!list.prospectos || !Array.isArray(list.prospectos)) {
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

                {loadingProspects && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>Cargando prospectos...</Typography>
                    </div>
                )}

                {!loadingProspects && userLists.length > 0 ? (
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
                ) : !loadingProspects && (
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