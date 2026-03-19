import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Avatar,
  Stack,
  Container
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import BuildIcon from '@mui/icons-material/Build';

const Header = ({ tabValue, onTabChange, mode, toggleTheme}) => {

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid divider', bgcolor: 'background.header' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', pt: 2, pb: 1, px: '0 !important' }}>
          <Box>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600, color: 'primary.superDark', lineHeight: 1.2 }}>
              Efeito Visual
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sistema de controle de estoque
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1, color: 'text.primary' }}>
                Guilherme
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Admin
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '0.9rem' }}>
              GG
            </Avatar>

            <IconButton
                onClick={toggleTheme}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.03)",
                  },
                }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
          </Stack>
        </Toolbar>

        <Box sx={{ mt: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 0,
                marginRight: 4,
                fontWeight: 500,
                fontSize: '0.95rem',
                color: 'text.scondary',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                px: 0,
                pb: 1.5,
              },
              '& .Mui-selected': {
                color: 'primary.light !important',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Dashboard" />
            <Tab icon={<ShoppingCartIcon fontSize="small" />} iconPosition="start" label="Vendas" />
            <Tab icon={<InventoryIcon fontSize="small" />} iconPosition="start" label="Produtos" />
            <Tab icon={<BuildIcon fontSize="small" />} iconPosition="start" label="Serviços" />
            <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="Clientes" />
          </Tabs>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;