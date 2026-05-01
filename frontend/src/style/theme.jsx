import { createTheme } from '@mui/material/styles';

export const BRAND_GRADIENT = 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)';
export const BRAND_GRADIENT_SOFT = 'linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(236,72,153,0.08) 100%)';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#9333ea' : '#a855f7',
      light: mode === 'light' ? '#a855f7' : '#c084fc',
      dark: mode === 'light' ? '#7e22ce' : '#9333ea',
      contrastText: '#fff',
    },
    secondary: {
      main: mode === 'light' ? '#ec4899' : '#f472b6',
      light: mode === 'light' ? '#f472b6' : '#f9a8d4',
      dark: mode === 'light' ? '#db2777' : '#ec4899',
      contrastText: '#fff',
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#059669',
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#2563eb',
    },
    background: {
      default: mode === 'light' ? '#fdf4ff' : '#0d0117',
      paper: mode === 'light' ? '#ffffff' : '#180330',
    },
    text: {
      primary: mode === 'light' ? '#0f0520' : '#f5f3ff',
      secondary: mode === 'light' ? '#78716c' : '#c4b5fd',
    },
    divider: mode === 'light' ? '#ede9fe' : '#2d1b4e',
    action: {
      hover: mode === 'light' ? 'rgba(147,51,234,0.05)' : 'rgba(168,85,247,0.08)',
      selected: mode === 'light' ? 'rgba(147,51,234,0.10)' : 'rgba(168,85,247,0.14)',
      disabledBackground: mode === 'light' ? '#f1f5f9' : '#1e1533',
    },
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
    h5: { fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
    button: { fontWeight: 600, textTransform: 'none' },
    overline: { fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '9px 20px',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
          textTransform: 'none',
        },
        contained: {
          background: BRAND_GRADIENT,
          boxShadow: '0 4px 14px rgba(147,51,234,0.35)',
          '&:hover': {
            background: BRAND_GRADIENT,
            boxShadow: '0 6px 20px rgba(147,51,234,0.45)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            background: mode === 'light' ? '#e9d5ff' : '#2d1b4e',
            color: mode === 'light' ? '#a78bfa' : '#6d28d9',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: mode === 'light' ? '#d8b4fe' : '#5b21b6',
          color: mode === 'light' ? '#9333ea' : '#a855f7',
          '&:hover': {
            borderColor: mode === 'light' ? '#9333ea' : '#7c3aed',
            backgroundColor: 'rgba(147,51,234,0.06)',
          },
        },
        text: {
          color: mode === 'light' ? '#9333ea' : '#a855f7',
          '&:hover': { backgroundColor: 'rgba(147,51,234,0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? '0 1px 3px rgba(147,51,234,0.08), 0 1px 2px rgba(147,51,234,0.04)'
            : 'none',
          border: '1px solid',
          borderRadius: 16,
          borderColor: mode === 'light' ? '#ede9fe' : '#2d1b4e',
          transition: 'all 0.25s ease',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0 1px 3px rgba(147,51,234,0.08), 0 1px 2px rgba(147,51,234,0.04)'
            : '0 1px 3px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === 'light' ? '#ede9fe' : '#2d1b4e',
          padding: '14px 16px',
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 700,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: mode === 'light' ? '#7e22ce' : '#c084fc',
          backgroundColor: mode === 'light' ? '#faf5ff' : '#1c0a2e',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontSize: '0.875rem',
            backgroundColor: mode === 'light' ? '#fdfbff' : 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: mode === 'light' ? '#e9d5ff' : '#3b1a5e' },
            '&:hover fieldset': { borderColor: mode === 'light' ? '#a855f7' : '#6d28d9' },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#9333ea' : '#a855f7',
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: '1px solid',
          borderColor: mode === 'light' ? '#ede9fe' : '#2d1b4e',
          overflow: 'hidden',
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 48,
          color: mode === 'light' ? '#78716c' : '#9d86e9',
          '&.Mui-selected': {
            color: mode === 'light' ? '#9333ea' : '#c084fc',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: BRAND_GRADIENT,
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: mode === 'light'
            ? '4px 0 24px rgba(147,51,234,0.08)'
            : '4px 0 32px rgba(0,0,0,0.5)',
          backgroundColor: mode === 'light' ? '#ffffff' : '#100022',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: mode === 'light' ? '#ede9fe' : '#2d1b4e' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          backgroundColor: mode === 'light' ? '#1a0533' : '#f5f3ff',
          color: mode === 'light' ? '#f5f3ff' : '#1a0533',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 4px',
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'rgba(147,51,234,0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(147,51,234,0.10)',
          },
        },
      },
    },
  },
});

const theme = (mode) => createTheme(getDesignTokens(mode));
export default theme;
