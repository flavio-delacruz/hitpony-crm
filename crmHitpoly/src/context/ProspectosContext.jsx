import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useRef,
} from "react";
import { useAuth } from "./AuthContext";

const ProspectosContext = createContext();

export const useProspectos = () => useContext(ProspectosContext);

export const ProspectosProvider = ({ children }) => {
    const { user } = useAuth();
    const [prospectos, setProspectos] = useState(() => {
        try {
            const localData = localStorage.getItem("prospectos");
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });
    const [loadingProspectos, setLoadingProspectos] = useState(false);
    const [errorProspectos, setErrorProspectos] = useState(null);
    const isCheckingForChanges = useRef(false);

    useEffect(() => {
        try {
            if (prospectos.length > 0) {
                localStorage.setItem("prospectos", JSON.stringify(prospectos));
            }
        } catch (error) {
            }
    }, [prospectos]);

    const fetchAllProspects = useCallback(async () => {
        if (!user || !user.id || isCheckingForChanges.current) {
            return;
        }


        isCheckingForChanges.current = true;
        setLoadingProspectos(true);
        setErrorProspectos(null);

        try {
            const { id, id_tipo } = user;
            let finalProspects = [];

            // --- Mueve esta lógica fuera de los if/else if de los roles ---
            // Esto asegura que el mapa de usuarios se cree para cualquier rol.
            const usersMap = {};
            const usersResponse = await fetch("https://apiweb.hitpoly.com/ajax/traerUsuariosController.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "getDataUsuarios" }),
            });
            const usersData = await usersResponse.json();
            
            if (usersData.data) {
                usersData.data.forEach((u) => {
                    usersMap[u.id] = u;
                });
            }

            // --- La lógica para cada rol permanece igual, solo que ahora usersMap siempre está disponible ---
            if (id_tipo === "1" || id_tipo === 1) {
                
                const setterUsers = usersData.data.filter(u => u.id_tipo === "2" || u.id_tipo === 2);
                const setterIds = setterUsers.map(u => u.id);

                if (setterIds.length > 0) {
                    const promises = setterIds.map(setterId =>
                        fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
                        }).then(res => res.json())
                    );
                    const allProspectsFromSetters = await Promise.all(promises);
                    finalProspects = allProspectsFromSetters.flatMap(data => data.resultado || []);
                    }
            } 
            else if (id_tipo === "2" || id_tipo === 2) {
                const userProspectsResponse = await fetch(
                    "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ funcion: "getProspectos", id: id }),
                    }
                );
                const userProspectsData = await userProspectsResponse.json();
                finalProspects = userProspectsData.resultado || [];
                }
            else if (id_tipo === "3" || id_tipo === 3) {
                const asignacionesResponse = await fetch(
                    "https://apiweb.hitpoly.com/ajax/traerAsignacionesController.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accion: "get" }),
                    }
                );
                const asignacionesData = await asignacionesResponse.json();
                let setterIds = [];
                if (asignacionesData.data && asignacionesData.data.length > 0) {
                    const asignacionDelCloser = asignacionesData.data.find(asignacion => Number(asignacion.id_closer) === Number(id));
                    if (asignacionDelCloser && asignacionDelCloser.setters_ids) {
                        try {
                            setterIds = JSON.parse(asignacionDelCloser.setters_ids);
                        } catch (e) {
                            }
                    }
                }
                if (setterIds.length > 0) {
                    const promises = setterIds.map(setterId =>
                        fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
                        }).then(res => res.json())
                    );
                    const allProspectsFromSetters = await Promise.all(promises);
                    finalProspects = allProspectsFromSetters.flatMap(data => data.resultado || []);
                }
                } 
            else if (id_tipo === "4" || id_tipo === 4) {
                const asignacionesResponse = await fetch(
                    "https://apiweb.hitpoly.com/ajax/getCloserClientesController.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accion: "get", cliente_id: id }),
                    }
                );
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
                        }).then(res => res.json())
                    );
                    const allProspectsFromSetters = await Promise.all(promises);
                    finalProspects = allProspectsFromSetters.flatMap(data => data.resultado || []);
                }
                }
            
            // --- Este paso ahora funciona para todos los roles ---
            const nuevosProspectosFormatted = finalProspects.map((item) => {
                const propietario = usersMap[item.usuario_master_id];
                const nombreCompletoPropietario = propietario
                    ? `${propietario.nombre} ${propietario.apellido}`
                    : "Desconocido";
                return {
                    id: item.id,
                    ...item,
                    nombrePropietario: nombreCompletoPropietario,
                };
            });
            
            setProspectos(nuevosProspectosFormatted);
            
        } catch (error) {
            setErrorProspectos("Error al cargar prospectos: " + error.message);
        } finally {
            setLoadingProspectos(false);
            isCheckingForChanges.current = false;
        }
    }, [user]);

    const deleteProspectsFromList = useCallback(async (prospectIds, listId) => {
        const previousProspects = [...prospectos];
        const updatedProspects = previousProspects.filter(p => !prospectIds.includes(p.id));
        setProspectos(updatedProspects);

        try {
            const deletePromises = prospectIds.map(prospectId =>
                fetch('https://apiweb.hitpoly.com/ajax/borrarSetterListaController.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accion: "BorrarSetter",
                        id: prospectId,
                        id_lista: listId,
                    }),
                })
            );
            const results = await Promise.all(deletePromises);
            let allSucceeded = results.every(response => response.ok);
            if (!allSucceeded) {
                setProspectos(previousProspects);
                alert('Hubo un error al eliminar los prospectos en el servidor. La lista se ha restaurado.');
            }
        } catch (error) {
            setProspectos(previousProspects);
            alert('Hubo un error de conexión, la lista se ha restaurado.');
        }
    }, [prospectos]);

    useEffect(() => {
        if (user?.id) {
            fetchAllProspects();
        }
    }, [user, fetchAllProspects]);

    const actualizarProspecto = useCallback((prospectoActualizado) => {
        setProspectos((prevProspectos) => {
            const updatedProspectos = prevProspectos.map((prospecto) =>
                prospecto.id === prospectoActualizado.id
                    ? prospectoActualizado
                    : prospecto
            );
            return updatedProspectos;
        });
    }, []);

    const value = {
        prospectos,
        loadingProspectos,
        errorProspectos,
        fetchProspectos: fetchAllProspects,
        actualizarProspecto,
        deleteProspectsFromList,
    };

    return (
        <ProspectosContext.Provider value={value}>
            {children}
        </ProspectosContext.Provider>
    );
};