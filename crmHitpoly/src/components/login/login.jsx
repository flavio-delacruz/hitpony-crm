import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

// 1. RUTA CORREGIDA: Desde 'components/login' a 'components/nav'
import LoginNavbar from "../nav/LoginNavbar"; 

import LoginContainer from "./LoginContainer";

// --- Lógica del Tema (Mantener en este archivo si es el punto de entrada) ---
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Paleta para modo claro
          background: {
            default: '#f4f6f8',
            paper: '#ffffff',
          },
        }
      : {
          // Paleta para modo oscuro (basado en el estilo neón)
          primary: {
            main: '#00EAF0', 
          },
          secondary: {
            main: '#FF2D75', 
          },
          background: {
            default: '#0b205eff', 
            paper: '#121522', 
          },
        }),
  },
});
// --------------------------------------------------------------------------

export default function Login() {
  // Estado para controlar el modo claro/oscuro
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Renderiza la barra de navegación */}
      <LoginNavbar 
        onToggleTheme={colorMode.toggleColorMode} 
        mode={mode} 
      />
      
      {/* Contenedor principal: añade 64px de espacio arriba para que el LoginContainer 
          no quede oculto debajo del AppBar fijo. */}
      <Box sx={{ paddingTop: '64px', minHeight: '100vh' }}>
        <LoginContainer />
      </Box>
    </ThemeProvider>
  );
}