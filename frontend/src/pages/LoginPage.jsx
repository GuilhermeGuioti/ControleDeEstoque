import React, { useState } from 'react';
import { Box, TextField, Typography, Stack, Alert, CircularProgress, InputAdornment, IconButton, Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BRAND_GRADIENT } from '../style/theme';

const LoginPage = ({ onLogin }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', senha: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.senha) {
      setError('Por favor, preencha email e senha');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await onLogin(formData.email, formData.senha);
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: isDark
        ? 'radial-gradient(ellipse at 15% 20%, rgba(147,51,234,0.25) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(236,72,153,0.2) 0%, transparent 50%), #0d0117'
        : 'radial-gradient(ellipse at 10% 10%, rgba(147,51,234,0.12) 0%, transparent 45%), radial-gradient(ellipse at 90% 90%, rgba(236,72,153,0.12) 0%, transparent 45%), #fdf4ff',
    }}>
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: isDark ? 'rgba(147,51,234,0.08)' : 'rgba(147,51,234,0.06)',
        filter: 'blur(80px)', top: '-10%', left: '-5%', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: isDark ? 'rgba(236,72,153,0.07)' : 'rgba(236,72,153,0.06)',
        filter: 'blur(60px)', bottom: '-5%', right: '-5%', pointerEvents: 'none',
      }} />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        sx={{ width: '100%', maxWidth: 440, px: 2, position: 'relative', zIndex: 1 }}
      >
        {/* Card */}
        <Box sx={{
          p: { xs: 3.5, sm: 5 },
          borderRadius: 4,
          bgcolor: isDark ? 'rgba(24,3,48,0.85)' : '#ffffff',
          backdropFilter: isDark ? 'blur(20px)' : 'none',
          border: '1px solid',
          borderColor: isDark ? 'rgba(147,51,234,0.25)' : '#ede9fe',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,51,234,0.1)'
            : '0 20px 60px rgba(147,51,234,0.12), 0 4px 16px rgba(147,51,234,0.06)',
        }}>
          {/* Brand */}
          <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{
              width: 60, height: 60, borderRadius: 3,
              background: BRAND_GRADIENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(147,51,234,0.45)',
            }}>
              <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{
                fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1,
                background: BRAND_GRADIENT, WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Bella Studio
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Gestão de Salão de Beleza
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Entre com suas credenciais para continuar
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5, borderRadius: 2,
                bgcolor: alpha('#ef4444', 0.08),
                border: '1px solid', borderColor: alpha('#ef4444', 0.2),
                color: 'error.main',
                '& .MuiAlert-icon': { color: 'error.main' },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                name="email"
                type="text"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'primary.main', fontSize: 18, opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                size="medium"
              />
              <TextField
                fullWidth
                name="senha"
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                value={formData.senha}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'primary.main', fontSize: 18, opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" tabIndex={-1}>
                        {showPassword
                          ? <VisibilityOffIcon sx={{ fontSize: 18 }} />
                          : <VisibilityIcon sx={{ fontSize: 18 }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="medium"
              />

              <Box sx={{ textAlign: 'right', mt: -0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: 'pointer', fontWeight: 600,
                    background: BRAND_GRADIENT, WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    '&:hover': { opacity: 0.8 },
                    transition: 'opacity 0.2s',
                  }}
                >
                  Esqueceu a senha?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                {isLoading
                  ? <CircularProgress size={22} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  : 'Entrar'
                }
              </Button>
            </Stack>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.secondary', opacity: 0.7 }}>
          © {new Date().getFullYear()} Bella Studio • Sistema de Gestão
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
