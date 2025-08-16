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
            console.error("Error al cargar prospectos desde localStorage", error);
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
            console.error("Error al guardar prospectos en localStorage", error);
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
            let allProspects = [];
            const { id, id_tipo } = user;

            if (id_tipo === "3" || id_tipo === 3) {
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
                            const parsedSetters = JSON.parse(asignacionDelCloser.setters_ids);
                            if (Array.isArray(parsedSetters)) {
                                setterIds = parsedSetters;
                            }
                        } catch (e) {
                            console.error("Error parsing setters_ids:", e);
                        }
                    }
                }
                const promises = setterIds.map(setterId =>
                    fetch("https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ funcion: "getProspectos", id: setterId }),
                    }).then(res => res.json())
                );
                const allProspectsFromSetters = await Promise.all(promises);
                allProspects = allProspectsFromSetters.flatMap(data => data.resultado || []);
            }

            const userProspectsResponse = await fetch(
                "https://apiweb.hitpoly.com/ajax/traerProspectosDeSetterConctroller.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ funcion: "getProspectos", id: id }),
                }
            );
            const userProspectsData = await userProspectsResponse.json();
            const prospectsFromUser = userProspectsData.resultado || [];
            
            const finalProspects = (user.id_tipo === "3" || user.id_tipo === 3)
                ? [...allProspects, ...prospectsFromUser]
                : prospectsFromUser;

            const nuevosProspectosFormatted = finalProspects.map((item) => ({
                id: item.id,
                ...item,
            }));
            
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
            
            let allSucceeded = true;
            results.forEach(response => {
                if (!response.ok) {
                    allSucceeded = false;
                    console.error('Error del servidor al eliminar un prospecto.');
                }
            });

            if (!allSucceeded) {
                setProspectos(previousProspects);
                alert('Hubo un error al eliminar los prospectos en el servidor. La lista se ha restaurado.');
            }
        } catch (error) {
            console.error('Error de conexión al eliminar los prospectos:', error);
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