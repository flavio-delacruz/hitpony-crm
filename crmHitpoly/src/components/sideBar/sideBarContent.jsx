// src/components/sideBar/sideBarContent.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Paper, // Necesario para el Panel de Detalle flotante
    Tooltip,
    Typography, // Para el título del panel
} from "@mui/material";
import { styled } from "@mui/system";

// === Iconos base
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CallIcon from "@mui/icons-material/Call";

// === Iconos submenú / UI
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import SegmentIcon from "@mui/icons-material/Segment";
import InboxIcon from "@mui/icons-material/Inbox";
import TaskIcon from "@mui/icons-material/Task";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DraftsIcon from "@mui/icons-material/Drafts";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LaunchIcon from "@mui/icons-material/Launch";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; // Para indicadores "up"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Para scroll del panel
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import LogoutModal from "../modals/logoutModal/logoutModal";
import LogoHitpoly from "../../../public/LogoHitpoly";
import { useAuth } from "../../context/AuthContext"; // Asumiendo que useAuth está definido

// === Tokens
const COLLAPSED_W = 72;
const EXPANDED_W = 260;
const DETAIL_W = 260; // Ancho del nuevo panel de detalle
const GAP = 8; // Espacio entre la barra y el panel de detalle
const BG_RAIL = "#2D1638";
const BG_PANEL = "#1E0F28"; // Fondo de la barra expandida y del panel de detalle
const SKY_BLUE = "#4FC3F7"; // Color de acento para títulos y algunos iconos
const HOVER_SOFT = "rgba(255,255,255,.08)"; // Hover de sub-elementos
const HOVER_SEL = "#5E35B1"; // Morado brillante para selección y hover de elementos principales
const VIEWPORT_MARGIN = 8; // Margen para el panel flotante

// === Estilos
const Wrapper = styled(Box)({
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 1200,
    pointerEvents: "none", // Permite clics a través del wrapper si no hay elementos activos
    fontFamily: "Montserrat, sans-serif",
});

const Shell = styled(Box)(({ $expanded }) => ({
    pointerEvents: "auto", // Habilita interacciones para la barra
    height: "100vh",
    width: $expanded ? EXPANDED_W : COLLAPSED_W,
    background: BG_PANEL,
    color: "#fff",
    transition: "width .18s ease, transform .18s ease", // Transición de ancho y posible transform
    display: "flex",
    flexDirection: "column",
    boxShadow: "inset -2px 0 6px rgba(0,0,0,.25)",
}));

// Panel de Detalle que puede ser flotante o fijo
const DetailPanel = styled(Paper)(({ $isFloating, $top = 0, $left = 0, $gap = 0 }) => ({
    pointerEvents: "auto",
    position: $isFloating ? "fixed" : "absolute", // Fijo para hover, Absoluto para expandido
    top: $top,
    left: $left + $gap, // Aquí añadimos el gap a la posición left
    width: DETAIL_W,
    height: $isFloating ? "auto" : "100vh",
    maxHeight: $isFloating ? `calc(100vh - ${VIEWPORT_MARGIN * 2}px)` : "100vh",
    backgroundColor: BG_PANEL, // Mismo color de fondo
    color: "#fff",
    borderRadius: $isFloating ? 12 : 0, // Borde redondeado si es flotante
    boxShadow: $isFloating ? "0 14px 34px rgba(0,0,0,.32), 0 8px 12px rgba(0,0,0,.24)" : "4px 0 20px rgba(0,0,0,.26)",
    zIndex: $isFloating ? 1202 : 1199, // Más alto si es flotante
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // Para manejar scroll interno
    transform: 'translateX(0)',
    opacity: 1,
    transition: 'transform .2s ease, opacity .2s ease, left .18s ease', // Añadimos transición para 'left'
    '&.hidden': {
        transform: 'translateX(-20px)',
        opacity: 0,
        pointerEvents: 'none',
    }
}));

const Header = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    background: BG_RAIL,
});

const Title = styled(Box)(({ $expanded }) => ({
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: SKY_BLUE,
    padding: $expanded ? "8px 14px" : 0,
    textTransform: "uppercase",
    opacity: $expanded ? 0.95 : 0,
    transition: "opacity .12s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
}));

const Row = styled(ListItemButton)(({ $expanded }) => ({
    borderRadius: 12,
    margin: $expanded ? "4px 8px" : "6px 8px",
    padding: $expanded ? "10px 10px" : 10,
    display: "grid",
    // === CAMBIO CLAVE: Establecemos un ancho fijo de 52px para la columna de iconos derecha
    gridTemplateColumns: $expanded ? "24px 1fr 52px" : "24px", 
    alignItems: "center",
    columnGap: 10,
    "&:hover": { backgroundColor: HOVER_SEL }, // Hover brillante
    "&.Mui-selected": { backgroundColor: HOVER_SEL }, // Seleccionado brillante
    position: "relative",
}));

const RowText = styled(ListItemText)(({ $expanded }) => ({
    opacity: $expanded ? 1 : 0,
    transition: "opacity .12s ease",
    "& .MuiTypography-root": { color: "#fff", fontSize: 15 },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    gridColumn: $expanded ? 2 : 'auto', 
}));

// Estilo para los contenedores de iconos a la derecha
const RightIcons = styled(Box)(({ $expanded }) => ({
    display: "flex",
    alignItems: "center",
    gridColumn: $expanded ? 3 : 'auto', 
    // Usamos flex-end para pegar los elementos al final de la columna de 52px
    justifyContent: 'flex-end', 
    // Altura completa para centrado vertical
    height: '100%', 
}));

// Estilos de iconos para asegurar que el área de clic y el icono se alineen
const IconBtnStyle = {
    color: "#fff", 
    p: 0, // padding 0 para que el Bookmark se pegue al borde derecho
    width: 24, // Ancho fijo del botón
    height: 24, // Altura fija del botón
};
const ChevronStyle = (isActive) => ({
    color: isActive ? SKY_BLUE : "rgba(255,255,255, 1)", 
    fontSize: 24, 
    transition: 'transform .15s'
});


// SubRow para elementos dentro del DetailPanel
const SubRow = styled(ListItemButton)(({ $selected }) => ({
    borderRadius: 8,
    margin: "2px 8px",
    padding: "8px 12px",
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    "&:hover": { backgroundColor: HOVER_SOFT }, 
    "&.Mui-selected": { backgroundColor: HOVER_SEL }, 
    "& .MuiTypography-root": { 
        color: $selected ? SKY_BLUE : "#fff", 
        fontSize: 15,
        flex: 1, 
        minWidth: 0, 
    },
}));


// === Componentes de flechas de scroll para el DetailPanel (si es flotante)
const HoverScroll = styled(Box)({
    position: "relative",
    maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px - 60px)`, // Altura del header + padding
    overflowY: "auto",
    padding: "6px 8px 10px 8px",
});
const FadeTop = styled(Box)({
    position: "absolute", top: 0, left: 0, right: 0, height: 22,
    background: "linear-gradient(180deg, rgba(30,15,40,1) 0%, rgba(30,15,40,0) 100%)",
    pointerEvents: "none", zIndex: 1,
});
const FadeBottom = styled(Box)({
    position: "absolute", bottom: 0, left: 0, right: 0, height: 22,
    background: "linear-gradient(0deg, rgba(30,15,40,1) 0%, rgba(30,15,40,0) 100%)",
    pointerEvents: "none", zIndex: 1,
});
const ArrowBtn = styled(IconButton)({
    position: "absolute", right: 6, width: 28, height: 28,
    backgroundColor: "rgba(255,255,255,.08)", zIndex: 2,
    "&:hover": { backgroundColor: "rgba(255,255,255,.16)" },
});


// === Datos
const mainItems = [
    { key: "home", text: "Inicio", icon: HomeIcon, path: "/dashboard" },
    { key: "team", text: "Equipo", icon: PeopleIcon, path: "/equipo" },
    { key: "lists", text: "Listas", icon: ListAltIcon, path: "/todas-las-listas" },
    { key: "metrics", text: "Métricas", icon: AssessmentIcon, path: "/metricas" },
    { type: "divider" },
    { key: "crm", text: "CRM", icon: ContactPageIcon, isMenu: true },
    { key: "support", text: "Servicio al cliente", icon: CallIcon, isMenu: true },
    { key: "data", text: "Gestión de datos", icon: SegmentIcon, isMenu: true },
];

const menuCRM = [
    { text: "Contactos", path: "/contactos" },
    { text: "Empresas", path: "/empresas" },
    { text: "Negocios (Texto muy largo para probar la alineación)", path: "/negocios" },
    { text: "Tickets", path: "/tickets" },
    { text: "Pedidos", path: "/pedidos" },
    { type: "divider" },
    { text: "Segmentos (listas)", path: "/segmentos" },
    { text: "Bandeja de entrada", path: "/bandeja" },
    { text: "Llamadas", path: "/llamadas" },
    { text: "Tareas", path: "/tareas" },
    { text: "Guías prácticas", path: "/guias" },
    { text: "Plantillas de mensajes", path: "/plantillas" },
    { text: "Fragmentos", path: "/fragmentos" },
];

const menuSupport = [
    { text: "Centro de ayuda", path: "/soporte/ayuda" },
    { text: "Éxito del cliente", path: "/soporte/exito" },
    { type: "divider" },
    { text: "Agente de clientes", path: "/soporte/agente" },
    { text: "Chatflows", path: "/soporte/chatflows" },
    { text: "Base de conocimientos", path: "/soporte/kb" },
    { text: "Portal del cliente (con texto muy, muy, muy largo)", path: "/soporte/portal" },
    { type: "divider" },
    { text: "Encuestas de feedback", path: "/soporte/encuestas" },
    { text: "Analíticas del servicio", path: "/soporte/analytics" },
];

// Menú de Gestión de datos con indicadores "Beta" y "up"
const menuData = [
    { text: "Agente de datos", path: "/data/agent", indicator: "beta" },
    { text: "Integración de datos", path: "/data/integration" },
    { text: "Gestión de eventos (¡Actualizado!)", path: "/data/events" },
    { text: "Calidad de los datos", path: "/data/quality", indicator: "up" },
    { text: "Conjuntos de datos", path: "/data/sets", indicator: "up" },
    { type: "divider" },
    { text: "Modelo de datos", path: "/data/model" },
    { text: "Enriquecimiento de datos", path: "/data/enrichment" },
];

const submenus = { crm: menuCRM, support: menuSupport, data: menuData };

export default function SideBarContent() {
    const { pathname } = useLocation();
    // const { user } = useAuth(); // Descomentar si usas autenticación

    // === Estado barra principal (expandida o colapsada)
    const [expanded, setExpanded] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    // === Estado del panel de detalle (activo, qué menú, posición)
    const [detailPanelActive, setDetailPanelActive] = useState(false); // ¿Hay un panel de detalle visible?
    const [currentDetailMenuKey, setCurrentDetailMenuKey] = useState(null); // 'crm', 'support', 'data'
    const [detailPanelTop, setDetailPanelTop] = useState(0); // Posición Y para panel flotante
    const [detailPanelLeft, setDetailPanelLeft] = useState(0); // Posición X para panel flotante
    const [isDetailFloating, setIsDetailFloating] = useState(false); // ¿Es flotante (hover) o fijo (expanded)?

    // Referencias para los botones del rail (para posicionar el panel flotante)
    const railBtnRefs = useRef({});
    const setRailBtnRef = (key) => (node) => { if (node) railBtnRefs.current[key] = node; };

    // Scroll para el panel de detalle flotante
    const hoverScrollRef = useRef(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const isSelected = (p) => !!p && pathname.startsWith(p);

    // Función para verificar si un submenú contiene la ruta activa
    const isSubmenuActive = (key) => {
        const menu = submenus[key] || [];
        return menu.some(item => item.path && pathname.startsWith(item.path));
    };

    // Ajusta el padding del body según el estado de la barra y el panel de detalle
    useEffect(() => {
        const prev = document.body.style.paddingLeft;
        let padding = COLLAPSED_W;

        if (expanded) {
            padding = EXPANDED_W;
            if (currentDetailMenuKey && !isDetailFloating) { // Solo si está expandido y el panel no es flotante
                padding += DETAIL_W + GAP; // SUMAMOS el GAP aquí también al padding del body
            }
        }
        
        document.body.style.paddingLeft = `${padding}px`;
        
        return () => { document.body.style.paddingLeft = prev; };
    }, [expanded, currentDetailMenuKey, isDetailFloating]);
    
    // Si la barra se colapsa, cerramos cualquier panel de detalle visible
    useEffect(() => {
        if (!expanded) {
            setDetailPanelActive(false);
            setCurrentDetailMenuKey(null);
        }
    }, [expanded]);

    // Lógica de scroll para el panel de detalle flotante
    const refreshScrollArrows = () => {
        const el = hoverScrollRef.current;
        if (!el) return;
        setCanScrollUp(el.scrollTop > 0);
        setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };
    useEffect(() => {
        if (!detailPanelActive || !isDetailFloating) return;
        const el = hoverScrollRef.current;
        if (!el) return;
        const onScroll = () => refreshScrollArrows();
        el.addEventListener("scroll", onScroll);
        refreshScrollArrows();
        return () => el.removeEventListener("scroll", onScroll);
    }, [detailPanelActive, isDetailFloating, currentDetailMenuKey]); // Depende del menú para recalcular altura


    // Manejar la apertura del panel de detalle (flotante o fijo)
    const openDetailPanel = (key, isFloatingMode, btnRect = null) => {
        setCurrentDetailMenuKey(key);
        setIsDetailFloating(isFloatingMode);
        setDetailPanelActive(true);

        if (isFloatingMode && btnRect) {
            // Calcular posición para el panel flotante
            const leftPos = COLLAPSED_W; // El panel flotante parte del final de la barra colapsada
            const viewportHeight = window.innerHeight;
            let topPos = Math.max(VIEWPORT_MARGIN, btnRect.top);

            // Ajuste para que no se salga por abajo (inicialmente estimamos una altura)
            const estimatedPanelHeight = 400; // Asumimos una altura, luego la ajustamos
            if (topPos + estimatedPanelHeight > viewportHeight - VIEWPORT_MARGIN) {
                topPos = viewportHeight - estimatedPanelHeight - VIEWPORT_MARGIN;
                topPos = Math.max(VIEWPORT_MARGIN, topPos); // Asegurar que no se suba demasiado
            }
            setDetailPanelTop(topPos);
            setDetailPanelLeft(leftPos);

            // Ajuste fino después de renderizar el contenido real
            requestAnimationFrame(() => {
                const panelBody = document.getElementById("detail-panel-body");
                if (panelBody) {
                    // Si es flotante, usamos la referencia al scrollable content para la altura
                    const contentHeight = isDetailFloating ? panelBody.querySelector('#hover-scroll-content')?.scrollHeight || 0 : panelBody.offsetHeight;
                    const headerHeight = 60; // Estimar o medir la altura del encabezado del panel
                    const actualPanelHeight = contentHeight + headerHeight; // Altura real del contenido + encabezado.
                    
                    let newTopPos = Math.max(VIEWPORT_MARGIN, btnRect.top);
                    if (newTopPos + actualPanelHeight > viewportHeight - VIEWPORT_MARGIN) {
                        newTopPos = viewportHeight - actualPanelHeight - VIEWPORT_MARGIN;
                        newTopPos = Math.max(VIEWPORT_MARGIN, newTopPos);
                    }
                    setDetailPanelTop(newTopPos);
                    refreshScrollArrows();
                }
            });
        } else if (!isFloatingMode) {
            setDetailPanelTop(0);
            setDetailPanelLeft(EXPANDED_W); // El panel fijo parte del final de la barra expandida
        }
    };

    // Cierra el panel de detalle
    const closeDetailPanel = () => {
        setDetailPanelActive(false);
        setCurrentDetailMenuKey(null);
    };

    // === UI
    return (
        <Wrapper
            // Este onMouseLeave es CRÍTICO para cerrar el panel flotante cuando se sale del área total
            onMouseLeave={() => {
                if (!expanded && isDetailFloating) {
                    closeDetailPanel();
                }
            }}
        >
            <Shell $expanded={expanded} onMouseEnter={() => { /* no hace nada si ya está expandido, si no, no se activa por hover en colapsado */ }}>
                {/* Logo */}
                <Header>
                    <LogoHitpoly />
                </Header>

                {/* Título solo cuando está expandido */}
                <Title $expanded={expanded}>Secciones</Title>

                {/* Lista principal */}
                <Box sx={{ flex: 1, overflowY: "auto", pb: 1 }}>
                    <List sx={{ p: 0 }}>
                        {mainItems.map((it, idx) => {
                            if (it.type === "divider") {
                                return (
                                    <Divider
                                        key={`div-${idx}`}
                                        sx={{ mx: expanded ? 1.5 : 0, my: 1, borderColor: "rgba(255,255,255,.15)" }}
                                    />
                                );
                            }
                            
                            // Determinar si el botón principal está "activo" (seleccionado o con el panel de detalle abierto)
                            const isMainSelected = isSelected(it.path) || isSubmenuActive(it.key);
                            const isActiveInPanel = currentDetailMenuKey === it.key;

                            return (
                                <Tooltip key={it.key} title={!expanded ? it.text : ""} placement="right" enterDelay={200}>
                                    <Row
                                        $expanded={expanded}
                                        component={it.path && !it.isMenu ? Link : "button"}
                                        to={it.path}
                                        selected={isMainSelected || isActiveInPanel}
                                        ref={setRailBtnRef(it.key)} // Para obtener la posición del botón
                                        onClick={(e) => {
                                            if (it.path && !it.isMenu) {
                                                closeDetailPanel(); // Si es un enlace directo, cierra el panel
                                                return; // Deja que Link maneje la navegación
                                            }
                                            e.preventDefault(); // Evita navegación si es botón o menú
                                            
                                            if (expanded) {
                                                // Si ya está expandido, click abre/cierra el panel de detalle fijo
                                                if (it.isMenu) {
                                                    if (currentDetailMenuKey === it.key && !isDetailFloating) {
                                                        closeDetailPanel();
                                                    } else {
                                                        openDetailPanel(it.key, false);
                                                    }
                                                } else { // Si es un botón sin menú en modo expandido
                                                    closeDetailPanel();
                                                }
                                            } else {
                                                // Si está colapsado, click primero expande la barra, luego abre el detalle
                                                if (it.isMenu) {
                                                    setExpanded(true);
                                                    setTimeout(() => openDetailPanel(it.key, false), 180); // Pequeño delay
                                                } else { // Si es un botón sin menú en modo colapsado
                                                    closeDetailPanel();
                                                }
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!expanded && it.isMenu) {
                                                // Si está colapsado, HOVER abre el panel de detalle flotante
                                                openDetailPanel(it.key, true, e.currentTarget.getBoundingClientRect());
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: (isMainSelected || isActiveInPanel) ? SKY_BLUE : "#fff", minWidth: 24 }}>
                                            <it.icon />
                                        </ListItemIcon>

                                        {/* Texto visible solo expandido */}
                                        <RowText $expanded={expanded} primary={it.text} />

                                        {/* Acciones derecha (solo expandido) */}
                                        {expanded && (
                                            <RightIcons $expanded={expanded}> {/* Usamos el componente RightIcons */}
                                                
                                                {/* Indicador de Menú / Navegación (Flecha: >) - VA PRIMERO */}
                                                {it.isMenu && <ChevronRightIcon sx={{ 
                                                    ...ChevronStyle(isActiveInPanel),
                                                    transform: isActiveInPanel ? 'rotate(90deg)' : 'none', 
                                                    // === AJUSTE: Margen a la derecha de la flecha
                                                    marginRight: '4px',
                                                }} />}

                                                {/* Marcador - VA SEGUNDO */}
                                                <IconButton
                                                    className="bookmark-btn"
                                                    size="small"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    sx={{ 
                                                        ...IconBtnStyle,
                                                        // No necesita margen izquierdo
                                                        marginLeft: 0, 
                                                    }} 
                                                >
                                                    <BookmarkBorderIcon fontSize="small" />
                                                </IconButton>
                                                
                                            </RightIcons>
                                        )}
                                    </Row>
                                </Tooltip>
                            );
                        })}
                    </List>
                </Box>

                {/* Footer: toggle expandir/colapsar + logout */}
                <Box
                    sx={{
                        px: 1, py: 1, display: "flex",
                        justifyContent: "space-between", // SIEMPRE justificado a los lados
                        alignItems: "center", borderTop: "1px solid rgba(255,255,255,.12)",
                    }}
                >
                    {/* Botón de Expandir/Colapsar (SIEMPRE VISIBLE) */}
                    <IconButton
                        size="small"
                        onClick={() => setExpanded((v) => !v)}
                        sx={{
                            color: "#fff", border: "1px solid rgba(255,255,255,.25)",
                            width: 28, height: 24, borderRadius: 8,
                            transition: 'all .15s ease'
                        }}
                        title={expanded ? "Colapsar" : "Expandir"}
                    >
                        {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>

                    {/* Botón de Cerrar Sesión (Siempre visible) */}
                    <Tooltip title="Cerrar sesión" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => setLogoutOpen(true)}
                            sx={{ 
                                color: "#fff", 
                                width: 28, 
                                height: 24, 
                                borderRadius: 8,
                            }}
                        >
                            <ExitToAppIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Shell>
            
            {/* PANEL DE DETALLE (Flotante o Fijo) */}
            {detailPanelActive && currentDetailMenuKey && (
                <DetailPanel 
                    $isFloating={isDetailFloating} 
                    $top={detailPanelTop} 
                    $left={isDetailFloating ? detailPanelLeft : EXPANDED_W}
                    $gap={GAP} // Pasamos el gap al panel de detalle
                    onMouseEnter={() => { // Para mantener el panel flotante abierto al entrar en él
                        if (!expanded && isDetailFloating) setDetailPanelActive(true);
                    }}
                    onMouseLeave={() => { // Cerrar el flotante si sale del panel
                        if (!expanded && isDetailFloating) closeDetailPanel();
                    }}
                    className={detailPanelActive ? '' : 'hidden'} // Para animaciones de CSS
                >
                    <Box sx={{ p: 2, background: BG_RAIL }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ color: SKY_BLUE, fontWeight: 800, fontSize: 16 }}
                        >
                            {mainItems.find(it => it.key === currentDetailMenuKey)?.text}
                        </Typography>
                    </Box>
                    <Box 
                        id="detail-panel-body" 
                        sx={{ flex: 1, position: 'relative' }}
                    >
                        {/* Contenedor con scroll si es flotante, o scroll normal si es fijo */}
                        <Box 
                            ref={isDetailFloating ? hoverScrollRef : null} 
                            id="hover-scroll-content" // ID para la medición de altura
                            sx={{ 
                                maxHeight: isDetailFloating ? `calc(100vh - ${VIEWPORT_MARGIN * 2}px - 60px)` : '100%',
                                overflowY: isDetailFloating ? 'auto' : 'visible',
                                overflowX: 'hidden',
                                padding: "6px 8px 10px 8px",
                            }}
                        >
                            <List sx={{ p: 0 }}>
                                {(submenus[currentDetailMenuKey] || []).map((sub, i) =>
                                    sub.type === "divider" ? (
                                        <Divider
                                            key={`subdiv-${currentDetailMenuKey}-${i}`}
                                            sx={{ mx: 1.5, my: 0.75, borderColor: "rgba(255,255,255,.12)" }}
                                        />
                                    ) : (
                                        <SubRow
                                            key={`${currentDetailMenuKey}-${sub.text}`}
                                            component={Link}
                                            to={sub.path}
                                            $selected={isSelected(sub.path)} // Pasa el prop selected para el estilo
                                            selected={isSelected(sub.path)}
                                            onClick={() => {
                                                // Al hacer clic en un sub-enlace, navegamos y cerramos el panel de detalle
                                                if (isDetailFloating) closeDetailPanel();
                                                // Si no es flotante, se mantiene abierto, pero puedes decidir cerrarlo aquí si quieres.
                                            }}
                                        >
                                            <ListItemText
                                                primary={sub.text}
                                            />
                                            <RightIcons> {/* Usamos el componente RightIcons */}
                                                {sub.indicator === "beta" && (
                                                    <Box sx={{ 
                                                        fontSize: 12, fontWeight: 'bold', px: 1, py: 0.5, 
                                                        borderRadius: 1, ml: 1, 
                                                        backgroundColor: HOVER_SEL, color: '#fff', 
                                                        lineHeight: 1 // Asegura que no rompa la alineación vertical
                                                    }}>
                                                        Beta
                                                    </Box>
                                                )}
                                                {sub.indicator === "up" && <KeyboardArrowUpIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 20, mr: 0.5 }} />}
                                                <IconButton
                                                    className="bookmark-btn"
                                                    size="small"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    sx={{ ...IconBtnStyle, marginLeft: '4px' }} // 4px de margen a la izquierda del marcador para separarlo del icono anterior
                                                >
                                                    <BookmarkBorderIcon fontSize="small" />
                                                </IconButton>
                                                <LaunchIcon
                                                    sx={{ fontSize: 18, color: "rgba(255,255,255,.75)", ml: 0.5 }} // ml: 0.5 para espacio
                                                />
                                            </RightIcons>
                                        </SubRow>
                                    )
                                )}
                            </List>
                        </Box>
                        
                        {/* Controles de scroll para panel flotante */}
                        {isDetailFloating && canScrollUp && <FadeTop />}
                        {isDetailFloating && canScrollDown && <FadeBottom />}
                        {isDetailFloating && canScrollUp && (
                            <ArrowBtn size="small" onClick={() => hoverScrollRef.current?.scrollBy({ top: -200, behavior: "smooth" })} sx={{ top: 6 }}>
                                <KeyboardArrowUpIcon sx={{ color: "#fff" }} />
                            </ArrowBtn>
                        )}
                        {isDetailFloating && canScrollDown && (
                            <ArrowBtn size="small" onClick={() => hoverScrollRef.current?.scrollBy({ top: 200, behavior: "smooth" })} sx={{ bottom: 6 }}>
                                <KeyboardArrowDownIcon sx={{ color: "#fff" }} />
                            </ArrowBtn>
                        )}
                    </Box>
                </DetailPanel>
            )}

            {/* MODAL LOGOUT */}
            <LogoutModal open={logoutOpen} handleClose={() => setLogoutOpen(false)} />
        </Wrapper>
    );
}