import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Stack, Divider, useTheme, alpha, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CategoryIcon from '@mui/icons-material/Category';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { BRAND_GRADIENT, BRAND_GRADIENT_SOFT } from '../style/theme';

const DRAWER_WIDTH = 268;

const menuItems = [
  { id: 0, label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { id: 1, label: 'PDV', icon: <PointOfSaleIcon fontSize="small" /> },
  { id: 5, label: 'Histórico de Vendas', icon: <ReceiptLongIcon fontSize="small" /> },
  { id: 2, label: 'Produtos', icon: <InventoryIcon fontSize="small" /> },
  { id: 6, label: 'Estoque (Lotes)', icon: <WarehouseIcon fontSize="small" /> },
  { id: 3, label: 'Serviços', icon: <ContentCutIcon fontSize="small" /> },
  { id: 4, label: 'Clientes', icon: <PeopleIcon fontSize="small" /> },
  { id: 7, label: 'Categorias', icon: <CategoryIcon fontSize="small" /> },
  { id: 8, label: 'Fabricantes', icon: <FactoryIcon fontSize="small" /> },
  { id: 9, label: 'Fornecedores', icon: <LocalShippingIcon fontSize="small" /> },
];

const Layout = ({ children, currentTab, onTabChange, mode, toggleTheme, onLogout }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Brand header */}
      <Box sx={{ px: 2.5, py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2.5,
            background: BRAND_GRADIENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            flexShrink: 0,
          }}>
            <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1,
              background: BRAND_GRADIENT, WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Bella Studio
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Gestão de Salão
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5, position: 'relative' }}>
              {isActive && (
                <Box sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 28,
                  borderRadius: '0 4px 4px 0',
                  background: BRAND_GRADIENT,
                  zIndex: 1,
                }} />
              )}
              <ListItemButton
                onClick={() => onTabChange(item.id)}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  pl: 2,
                  ml: isActive ? 0.5 : 0,
                  background: isActive ? BRAND_GRADIENT_SOFT : 'transparent',
                  '&:hover': {
                    background: isActive
                      ? BRAND_GRADIENT_SOFT
                      : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* User section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          p: 1.5, borderRadius: 2.5, mb: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{
              background: BRAND_GRADIENT,
              width: 36, height: 36,
              fontSize: '0.8rem', fontWeight: 800,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}>
              KM
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
                Katrine
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Administradora
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'} placement="top">
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                flex: 1, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
                transition: 'all 0.2s',
              }}
            >
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sair" placement="top">
            <IconButton
              onClick={onLogout}
              size="small"
              sx={{
                flex: 1, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'error.main',
                  color: 'error.main',
                  bgcolor: alpha(theme.palette.error.main, 0.06),
                },
                transition: 'all 0.2s',
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <Box sx={{
              width: 6, height: 6, borderRadius: '50%',
              background: BRAND_GRADIENT,
              display: { xs: 'none', sm: 'block' },
            }} />
            <Typography variant="h6" noWrap sx={{ fontWeight: 700, fontSize: '1rem' }}>
              {menuItems.find(m => m.id === currentTab)?.label}
            </Typography>
          </Stack>

          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
              <IconButton size="small" onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
