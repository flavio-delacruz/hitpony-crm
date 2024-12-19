import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Link, Divider, Grid, Card } from "@mui/material";
import loginImage from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();




  const handleLogin = async () => {
    try {
      const response = await axios.post('https://apisistemamembresia.hitpoly.com/ajax/usuarioController.php', {
        funcion: 'login',
        user: email,
        pass: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      console.log("respuesta de inicio de sesion", response.data.status);
  
      if (response.data.status === 'success' && response.data.message === 'logueado') {
   
        navigate('/dashboard'); 
      }
      else {
      
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('Error en la solicitud');
    }
  };
  







  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', backgroundColor: '#F2F2F2' }}>
        <Grid container justifyContent="center" spacing={2} alignItems="center">
          <Grid item>
            <Card
              sx={{
                padding: '30px',
                maxWidth: '400px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Crm Hitpoly
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                La tecnología conectada con la ciencia!
              </Typography>

              <TextField
                fullWidth
                label="nombre de usuario"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                onKeyDown={handleKeyDown} 
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                onKeyDown={handleKeyDown} 
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                sx={{
                  marginTop: '20px',
                  background: 'linear-gradient(45deg, #91A0F2, #1BAFBF, #7732D9)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7732D9, #1BAFBF, #91A0F2)',
                  },
                }}
              >
                Ingresar
              </Button>

              {error && (
                <Typography variant="body2" color="error" sx={{ marginTop: '10px' }}>
                  {error}
                </Typography>
              )}

              {/* <Typography variant="body2" sx={{ marginTop: '20px' }}>
                ¿No tienes cuenta? <Link href="/register">Crear cuenta</Link>
              </Typography> */}

              <Divider sx={{ marginY: '20px' }}>O</Divider>

              <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
           
              </Box>

              <Typography variant="body2" color="textSecondary">
                info@hitpoly.com
              </Typography>
            </Card>
          </Grid>

          <Grid item>
            <Box
              sx={{
                width: '450px',
                height: '450px',
                backgroundImage: `url(${loginImage})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginLeft: '40px',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
