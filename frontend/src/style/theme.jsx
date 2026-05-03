import { createTheme } from '@mui/material/styles';

export const BRAND_GRADIENT = 'linear-gradient(135deg, #9B7B00 0%, #F5C842 100%)';
export const BRAND_GRADIENT_SOFT = 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(245,200,66,0.08) 100%)';

const getDesignTokens = (mode) => {
  const isDark = mode === 'dark';
  const brandGradient = isDark
    ? 'linear-gradient(135deg, #9B7B00 0%, #F5C842 100%)'
    : 'linear-gradient(135deg, #5C4509 0%, #B8860B 100%)';

  return {
    palette: {
      mode,
      primary: {
        main: isDark ? '#C9A227' : '#8B6914',
        light: isDark ? '#F5C842' : '#B8860B',
        dark: isDark ? '#9B7B00' : '#5C4509',
        contrastText: isDark ? '#0A0A0A' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#F5C842' : '#5C4509',
        light: isDark ? '#FFD966' : '#8B6914',
        dark: isDark ? '#C9A227' : '#3D2E06',
        contrastText: isDark ? '#0A0A0A' : '#ffffff',
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
        default: isDark ? '#0A0A0A' : '#F9F7F0',
        paper: isDark ? '#141410' : '#ffffff',
      },
      text: {
        primary: isDark ? '#F5F2E8' : '#1A1408',
        secondary: isDark ? '#A89B6E' : '#6B6340',
      },
      divider: isDark ? '#2A2510' : '#E8E3CC',
      action: {
        hover: isDark ? 'rgba(201,162,39,0.08)' : 'rgba(139,105,20,0.06)',
        selected: isDark ? 'rgba(201,162,39,0.14)' : 'rgba(139,105,20,0.10)',
        disabledBackground: isDark ? '#1A1810' : '#F0EDD8',
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
            background: brandGradient,
            boxShadow: isDark
              ? '0 4px 14px rgba(201,162,39,0.30)'
              : '0 4px 14px rgba(92,69,9,0.25)',
            '&:hover': {
              background: brandGradient,
              boxShadow: isDark
                ? '0 6px 20px rgba(201,162,39,0.45)'
                : '0 6px 20px rgba(92,69,9,0.38)',
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': {
              background: isDark ? '#2A2510' : '#E8E3CC',
              color: isDark ? '#5A4D22' : '#A89060',
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: isDark ? '#4A3A10' : '#C9A060',
            color: isDark ? '#C9A227' : '#8B6914',
            '&:hover': {
              borderColor: isDark ? '#C9A227' : '#5C4509',
              backgroundColor: isDark ? 'rgba(201,162,39,0.06)' : 'rgba(139,105,20,0.06)',
            },
          },
          text: {
            color: isDark ? '#C9A227' : '#8B6914',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(201,162,39,0.06)' : 'rgba(139,105,20,0.06)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? 'none'
              : '0 1px 3px rgba(139,105,20,0.08), 0 1px 2px rgba(139,105,20,0.04)',
            border: '1px solid',
            borderRadius: 16,
            borderColor: isDark ? '#2A2510' : '#E8E3CC',
            transition: 'all 0.25s ease',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          elevation1: {
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.6)'
              : '0 1px 3px rgba(139,105,20,0.08), 0 1px 2px rgba(139,105,20,0.04)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark ? '#2A2510' : '#E8E3CC',
            padding: '14px 16px',
            fontSize: '0.875rem',
          },
          head: {
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isDark ? '#C9A227' : '#5C4509',
            backgroundColor: isDark ? '#0F0E0A' : '#F5F0DC',
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
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FDFBF3',
              '& fieldset': { borderColor: isDark ? '#3A2F0E' : '#DDD4A8' },
              '&:hover fieldset': { borderColor: isDark ? '#9B7B00' : '#8B6914' },
              '&.Mui-focused fieldset': {
                borderColor: isDark ? '#C9A227' : '#8B6914',
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
            borderColor: isDark ? '#2A2510' : '#E8E3CC',
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
            color: isDark ? '#6B5E38' : '#9B8A5A',
            '&.Mui-selected': {
              color: isDark ? '#C9A227' : '#5C4509',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            background: brandGradient,
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: isDark
              ? '4px 0 32px rgba(0,0,0,0.7)'
              : '4px 0 24px rgba(139,105,20,0.08)',
            backgroundColor: isDark ? '#0D0D0B' : '#ffffff',
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
          root: { borderColor: isDark ? '#2A2510' : '#E8E3CC' },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
            backgroundColor: isDark ? '#F5F2E8' : '#1A1408',
            color: isDark ? '#1A1408' : '#F5F2E8',
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
              backgroundColor: isDark ? 'rgba(201,162,39,0.08)' : 'rgba(139,105,20,0.06)',
            },
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(201,162,39,0.14)' : 'rgba(139,105,20,0.10)',
            },
          },
        },
      },
    },
  };
};

const theme = (mode) => createTheme(getDesignTokens(mode));
export default theme;
