import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Stack, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SpaIcon from '@mui/icons-material/Spa';

const LoginPage = ({ onLogin }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (formData.email && formData.senha) {
        onLogin(formData.email, formData.senha);
      } else {
        setError('Por favor, preencha email e senha');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 3,
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ width: '100%', maxWidth: 420 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SpaIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Bella Studio
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Gestão de Salão de Beleza
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
            Acceso ao Sistema
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
            Entre com suas credenciais para continuar
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                name="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    cursor: 'pointer', 
                    color: 'primary.main',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Esqueceu a senha?
                </Typography>
              </Box>

              <Box
                component="button"
                type="submit"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  border: 'none',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground',
                    cursor: 'not-allowed',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.secondary' }}>
          © 2025 Bella Studio • Sistema de Gestão
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;