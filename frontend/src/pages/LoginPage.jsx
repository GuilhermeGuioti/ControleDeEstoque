import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton, 
  Stack, 
  useTheme 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Google, Facebook, GitHub, LinkedIn } from '@mui/icons-material';

const LoginPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const theme = useTheme();

  const toggleMode = () => setIsSignIn(!isSignIn);

  const mainGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        component={motion.div}
        layout
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: '95%',
          height: 550,
          backgroundColor: 'theme.palette.background.default',
          borderRadius: 6,
          boxShadow: '0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Box 
          sx={{ 
            width: '50%', 
            p: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1 
          }}
        >
          <AnimatePresence mode="wait">
            {isSignIn ? (
              <FormContent 
                key="signin"
                title="Entrar" 
                subtitle="or use your email password"
                buttonText="SIGN IN"
                showName={false}
                theme={theme}
              />
            ) : (
              <FormContent 
                key="signup"
                title="Create Account" 
                subtitle="or use your email for registration"
                buttonText="SIGN UP"
                showName={true}
                theme={theme}
              />
            )}
          </AnimatePresence>
        </Box>

        <Box
          component={motion.div}
          initial={false}
          animate={{ 
            x: isSignIn ? '0%' : '-100%',
            // Inverte a curvatura dependendo do lado
            borderTopLeftRadius: isSignIn ? '120px' : '0px',
            borderBottomLeftRadius: isSignIn ? '120px' : '0px',
            borderTopRightRadius: isSignIn ? '0px' : '120px',
            borderBottomRightRadius: isSignIn ? '0px' : '120px',
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          sx={{
            position: 'absolute',
            right: 0,
            width: '50%',
            height: '100%',
            background: mainGradient,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            zIndex: 5,
          }}
        >
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ mb: 2 }}>
            {isSignIn ? "Bella Stutio" : "Bella Stutio"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: '80%', opacity: 0.9 }}>
            {isSignIn 
              ? "Cadastre-se com seus dados pessoais para usar todos os recursos do site." 
              : "Insira seus dados pessoais para usar todos os recursos do site."}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={toggleMode}
            sx={{ 
              borderRadius: 8, 
              px: 5, 
              py: 1,
              borderColor: 'white',
              color: 'white',
              borderWidth: 2,
              '&:hover': { borderWidth: 2, borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } 
            }}
          >
            {isSignIn ? "Registrar" : "Entar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const FormContent = ({ title, buttonText, showName, theme }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    sx={{ width: '100%', textAlign: 'center' }}
  >
    <Typography variant="h4" fontWeight="800" sx={{ mb: 3, color: theme.palette.text.primary }}>
      {title}
    </Typography>

    <Stack spacing={2.5} sx={{ width: '100%', px: 2 }}>
      {showName && (
        <TextField 
          fullWidth 
          placeholder="Name" 
          variant="filled" 
          InputProps={{ disableUnderline: true, sx: { borderRadius: 2, backgroundColor: theme.palette.action.hover } }}
        />
      )}
      <TextField 
        fullWidth 
        placeholder="Email" 
        variant="filled" 
        InputProps={{ disableUnderline: true, sx: { borderRadius: 2, backgroundColor: theme.palette.action.hover } }}
      />
      <TextField 
        fullWidth 
        type="password" 
        placeholder="Password" 
        variant="filled" 
        InputProps={{ disableUnderline: true, sx: { borderRadius: 2, backgroundColor: theme.palette.action.hover } }}
      />
      
      {!showName && (
        <Typography 
          variant="caption" 
          sx={{ cursor: 'pointer', mt: 1, color: theme.palette.text.secondary, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
        >
          Forget Your Password?
        </Typography>
      )}

      <Button 
        variant="contained" 
        disableElevation
        sx={{ 
          mt: 2, 
          borderRadius: 3, 
          py: 1.8,
          fontWeight: 'bold',
          backgroundColor: theme.palette.primary.main,
          '&:hover': { backgroundColor: theme.palette.primary.dark }
        }}
      >
        {buttonText}
      </Button>
    </Stack>
  </Box>
);

export default LoginPage;