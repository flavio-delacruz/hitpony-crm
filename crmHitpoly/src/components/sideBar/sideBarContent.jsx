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
    Paper,
    Tooltip,
    Typography,
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import LogoutModal from "../modals/logoutModal/logoutModal";
import LogoHitpoly from "../../../public/LogoHitpoly";
import { useAuth } from "../../context/AuthContext";

// === Tokens
const COLLAPSED_W = 72;
const EXPANDED_W = 260;
const DETAIL_W = 260;
const GAP = 8;
const BG_RAIL = "#2D1638";
const BG_PANEL = "#1E0F28";
const SKY_BLUE = "#4FC3F7";
const HOVER_SOFT = "rgba(255,255,255,.08)";
const HOVER_SEL = "#5E35B1";
const VIEWPORT_MARGIN = 8;

// === Estilos
const Wrapper = styled(Box)({
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 1200,
    pointerEvents: "none",
    fontFamily: "Montserrat, sans-serif",
});

const Shell = styled(Box)(({ $expanded }) => ({
    pointerEvents: "auto",
    height: "100vh",
    width: $expanded ? EXPANDED_W : COLLAPSED_W,
    background: BG_PANEL,
    color: "#fff",
    transition: "width .18s ease, transform .18s ease",
    display: "flex",
    flexDirection: "column",
    boxShadow: "inset -2px 0 6px rgba(0,0,0,.25)",
}));

const DetailPanel = styled(Paper)(({ $isFloating, $top = 0, $left = 0, $gap = 0 }) => ({
    pointerEvents: "auto",
    position: $isFloating ? "fixed" : "absolute",
    top: $top,
    left: $left + $gap,
    width: DETAIL_W,
    height: $isFloating ? "auto" : "100vh",
    maxHeight: $isFloating ? `calc(100vh - ${VIEWPORT_MARGIN * 2}px)` : "100vh",
    backgroundColor: BG_PANEL,
    color: "#fff",
    borderRadius: $isFloating ? 12 : 0,
    boxShadow: $isFloating ? "0 14px 34px rgba(0,0,0,.32), 0 8px 12px rgba(0,0,0,.24)" : "4px 0 20px rgba(0,0,0,.26)",
    zIndex: $isFloating ? 1202 : 1199,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transform: 'translateX(0)',
    opacity: 1,
    transition: 'transform .2s ease, opacity .2s ease, left .18s ease',
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

// === ESTILOS QUE ALINEAN LOS ICONOS AL BORDE DERECHO (ESQUINA) ===
const Row = styled(ListItemButton)(({ $expanded }) => ({
    borderRadius: 12,
    margin: $expanded ? "4px 8px" : "6px 8px",
    padding: $expanded ? "10px 10px" : 10,
    display: "grid",
    // CLAVE: 24px (icono) | 1fr (texto) | 52px (columna de iconos fijos)
    gridTemplateColumns: $expanded ? "24px 1fr 52px" : "24px", 
    alignItems: "center",
    columnGap: 10, 
    "&:hover": { backgroundColor: HOVER_SEL },
    "&.Mui-selected": { backgroundColor: HOVER_SEL },
    position: "relative",
}));

const RowText = styled(ListItemText)(({ $expanded }) => ({
    opacity: $expanded ? 1 : 0,
    transition: "opacity .12s ease",
    "& .MuiTypography-root": { 
        color: "#fff", 
        fontSize: 15,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    gridColumn: $expanded ? 2 : 'auto', 
    minWidth: 0, 
}));

const RightIcons = styled(Box)(({ $expanded }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: 'flex-end', 
    gridColumn: $expanded ? 3 : 'auto',
    height: '100%',
    gap: 4, 
}));
// =============================================================

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

const HoverScroll = styled(Box)({
    position: "relative",
    maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px - 60px)`,
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

const IconBtnStyle = {
    color: "#fff", 
    p: 0,
    width: 24,
    height: 24,
    flexShrink: 0,
};

const NavIconStyle = (isActive) => ({
    color: isActive ? SKY_BLUE : "rgba(255,255,255, 1)", 
    fontSize: 24,
    flexShrink: 0,
    transition: 'transform .15s'
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
    const [expanded, setExpanded] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [detailPanelActive, setDetailPanelActive] = useState(false);
    const [currentDetailMenuKey, setCurrentDetailMenuKey] = useState(null);
    const [detailPanelTop, setDetailPanelTop] = useState(0);
    const [detailPanelLeft, setDetailPanelLeft] = useState(0);
    const [isDetailFloating, setIsDetailFloating] = useState(false);

    const railBtnRefs = useRef({});
    const setRailBtnRef = (key) => (node) => { if (node) railBtnRefs.current[key] = node; };

    const hoverScrollRef = useRef(null);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    const isSelected = (p) => !!p && pathname.startsWith(p);

    const isSubmenuActive = (key) => {
        const menu = submenus[key] || [];
        return menu.some(item => item.path && pathname.startsWith(item.path));
    };

    useEffect(() => {
        const prev = document.body.style.paddingLeft;
        let padding = COLLAPSED_W;

        if (expanded) {
            padding = EXPANDED_W;
            if (currentDetailMenuKey && !isDetailFloating) {
                padding += DETAIL_W + GAP;
            }
        }
        
        document.body.style.paddingLeft = `${padding}px`;
        
        return () => { document.body.style.paddingLeft = prev; };
    }, [expanded, currentDetailMenuKey, isDetailFloating]);
    
    useEffect(() => {
        if (!expanded) {
            setDetailPanelActive(false);
            setCurrentDetailMenuKey(null);
        }
    }, [expanded]);

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
    }, [detailPanelActive, isDetailFloating, currentDetailMenuKey]);

    const openDetailPanel = (key, isFloatingMode, btnRect = null) => {
        setCurrentDetailMenuKey(key);
        setIsDetailFloating(isFloatingMode);
        setDetailPanelActive(true);

        if (isFloatingMode && btnRect) {
            const leftPos = COLLAPSED_W;
            const viewportHeight = window.innerHeight;
            let topPos = Math.max(VIEWPORT_MARGIN, btnRect.top);

            const estimatedPanelHeight = 400;
            if (topPos + estimatedPanelHeight > viewportHeight - VIEWPORT_MARGIN) {
                topPos = viewportHeight - estimatedPanelHeight - VIEWPORT_MARGIN;
                topPos = Math.max(VIEWPORT_MARGIN, topPos);
            }
            setDetailPanelTop(topPos);
            setDetailPanelLeft(leftPos);

            requestAnimationFrame(() => {
                const panelBody = document.getElementById("detail-panel-body");
                if (panelBody) {
                    const contentHeight = isDetailFloating ? panelBody.querySelector('#hover-scroll-content')?.scrollHeight || 0 : panelBody.offsetHeight;
                    const headerHeight = 60;
                    const actualPanelHeight = contentHeight + headerHeight;
                    
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
            setDetailPanelLeft(EXPANDED_W);
        }
    };

    const closeDetailPanel = () => {
        setDetailPanelActive(false);
        setCurrentDetailMenuKey(null);
    };

    return (
        <Wrapper
            onMouseLeave={() => {
                if (!expanded && isDetailFloating) {
                    closeDetailPanel();
                }
            }}
        >
            <Shell $expanded={expanded}>
                <Header>
                    <LogoHitpoly />
                </Header>

                <Title $expanded={expanded}>Secciones</Title>

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
                            
                            const isMainSelected = isSelected(it.path) || isSubmenuActive(it.key);
                            const isActiveInPanel = currentDetailMenuKey === it.key;

                            return (
                                <Tooltip key={it.key} title={!expanded ? it.text : ""} placement="right" enterDelay={200}>
                                    <Row
                                        $expanded={expanded}
                                        component={it.path && !it.isMenu ? Link : "button"}
                                        to={it.path}
                                        selected={isMainSelected || isActiveInPanel}
                                        ref={setRailBtnRef(it.key)}
                                        // Añadir onClick para abrir el detalle cuando no está expandido y es un menú
                                        onClick={it.isMenu && !expanded 
                                            ? (e) => {
                                                e.preventDefault(); // Evita la navegación si es un botón
                                                const btnRect = railBtnRefs.current[it.key]?.getBoundingClientRect();
                                                openDetailPanel(it.key, true, btnRect);
                                            }
                                            : undefined // Dejar el comportamiento por defecto si no es menú o está expandido
                                        }
                                        onMouseEnter={it.isMenu && !expanded
                                            ? (e) => {
                                                const btnRect = e.currentTarget.getBoundingClientRect();
                                                openDetailPanel(it.key, true, btnRect);
                                            }
                                            : expanded && it.isMenu && !isActiveInPanel
                                                ? () => openDetailPanel(it.key, false)
                                                : undefined
                                        }
                                        onMouseLeave={expanded && it.isMenu && !isActiveInPanel
                                            ? () => {} // Dejarlo vacío para que no cierre inmediatamente
                                            : undefined
                                        }
                                    >
                                        <ListItemIcon sx={{ 
                                            color: (isMainSelected || isActiveInPanel) ? SKY_BLUE : "#fff", 
                                            minWidth: 24,
                                            gridColumn: 1 
                                        }}>
                                            <it.icon />
                                        </ListItemIcon>

                                        {/* Texto - Se expande con 1fr */}
                                        <RowText $expanded={expanded} primary={it.text} />

                                        {/* ICONOS DERECHOS - POSICIÓN FIJA DENTRO DEL GRID */}
                                        {expanded && (
                                            <RightIcons $expanded={expanded}> 
                                                
                                                {/* Marcador - VA PRIMERO ahora, pegado a la izquierda de la columna de 52px */}
                                                <IconButton
                                                    className="bookmark-btn"
                                                    size="small"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    sx={IconBtnStyle}
                                                >
                                                    <BookmarkBorderIcon fontSize="small" />
                                                </IconButton>

                                                {/* Indicador de Menú / Flecha (> o v) - VA SEGUNDO, pegado al borde derecho */}
                                                {it.isMenu && (
                                                    isActiveInPanel ? (
                                                        <KeyboardArrowDownIcon sx={NavIconStyle(isActiveInPanel)} />
                                                    ) : (
                                                        <ChevronRightIcon sx={NavIconStyle(isActiveInPanel)} />
                                                    )
                                                )}
                                                
                                            </RightIcons>
                                        )}
                                    </Row>
                                </Tooltip>
                            );
                        })}
                    </List>
                </Box>

                <Box
                    sx={{
                        px: 1, py: 1, display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center", borderTop: "1px solid rgba(255,255,255,.12)",
                    }}
                >
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
            
            {detailPanelActive && currentDetailMenuKey && (
                <DetailPanel 
                    $isFloating={isDetailFloating} 
                    $top={detailPanelTop} 
                    $left={isDetailFloating ? detailPanelLeft : EXPANDED_W}
                    $gap={GAP}
                    onMouseEnter={() => {
                        if (!expanded && isDetailFloating) setDetailPanelActive(true);
                    }}
                    onMouseLeave={() => {
                        if (!expanded && isDetailFloating) closeDetailPanel();
                    }}
                    className={detailPanelActive ? '' : 'hidden'}
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
                        <Box 
                            ref={isDetailFloating ? hoverScrollRef : null} 
                            id="hover-scroll-content"
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
                                            $selected={isSelected(sub.path)}
                                            selected={isSelected(sub.path)}
                                            onClick={() => {
                                                if (isDetailFloating) closeDetailPanel();
                                            }}
                                        >
                                            <ListItemText
                                                primary={sub.text}
                                            />
                                            <RightIcons>
                                                {sub.indicator === "beta" && (
                                                    <Box sx={{ 
                                                        fontSize: 12, fontWeight: 'bold', px: 1, py: 0.5, 
                                                        borderRadius: 1, ml: 1, 
                                                        backgroundColor: HOVER_SEL, color: '#fff', 
                                                        lineHeight: 1
                                                    }}>
                                                        Beta
                                                    </Box>
                                                )}
                                                {sub.indicator === "up" && <KeyboardArrowUpIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 20, mr: 0.5 }} />}
                                                <IconButton
                                                    className="bookmark-btn"
                                                    size="small"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    sx={{ ...IconBtnStyle, marginLeft: '4px' }}
                                                >
                                                    <BookmarkBorderIcon fontSize="small" />
                                                </IconButton>
                                                <LaunchIcon
                                                    sx={{ fontSize: 18, color: "rgba(255,255,255,.75)", ml: 0.5 }}
                                                />
                                            </RightIcons>
                                        </SubRow>
                                    )
                                )}
                            </List>
                        </Box>
                        
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

            <LogoutModal open={logoutOpen} handleClose={() => setLogoutOpen(false)} />
        </Wrapper>
    );
}