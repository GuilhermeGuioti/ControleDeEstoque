import React, { useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Stack, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { BRAND_GRADIENT } from '../style/theme';

const STAT_CARDS = [
  {
    key: 'stock',
    title: 'Valor em Estoque',
    icon: AttachMoneyIcon,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    shadow: 'rgba(16,185,129,0.35)',
    tab: 2,
  },
  {
    key: 'services',
    title: 'Serviços',
    icon: ContentCutIcon,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    shadow: 'rgba(59,130,246,0.35)',
    tab: 3,
  },
  {
    key: 'clients',
    title: 'Clientes',
    icon: PeopleIcon,
    gradient: BRAND_GRADIENT,
    shadow: 'rgba(147,51,234,0.35)',
    tab: 4,
  },
  {
    key: 'sales',
    title: 'Vendas Hoje',
    icon: ShoppingCartIcon,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: 'rgba(245,158,11,0.35)',
    tab: 1,
  },
];

const StatCard = ({ config, value, subtitle, onClick }) => {
  const Icon = config.icon;
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': onClick ? {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 28px ${config.shadow}`,
        } : {},
      }}
    >
      {/* Accent top bar */}
      <Box sx={{ height: 4, background: config.gradient }} />

      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              {config.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25, lineHeight: 1.2 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2.5, flexShrink: 0,
            background: config.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${config.shadow}`,
          }}>
            <Icon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const AlertTable = ({ title, icon: Icon, iconColor, badge, children }) => (
  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{
        width: 32, height: 32, borderRadius: 1.5,
        bgcolor: alpha(iconColor, 0.12),
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon sx={{ color: iconColor, fontSize: 16 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
        {title}
      </Typography>
      {badge != null && badge > 0 && (
        <Chip
          label={badge}
          size="small"
          sx={{
            fontWeight: 700, fontSize: '0.7rem',
            bgcolor: alpha(iconColor, 0.12),
            color: iconColor,
            border: '1px solid', borderColor: alpha(iconColor, 0.25),
          }}
        />
      )}
    </Box>
    <TableContainer sx={{ maxHeight: 260 }}>
      <Table size="small" stickyHeader>
        {children}
      </Table>
    </TableContainer>
  </Card>
);

const EmptyRow = ({ cols, text }) => (
  <TableRow>
    <TableCell colSpan={cols} sx={{ textAlign: 'center', py: 6, border: 'none' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        {text}
      </Typography>
    </TableCell>
  </TableRow>
);

const DashboardPage = ({ products = [], services = [], clients = [], onNavigate }) => {
  const stats = useMemo(() => {
    let totalValue = 0;
    let lowStockCount = 0;
    products.forEach(item => {
      totalValue += (item.quantidade || 0) * (item.preco || 0);
      if ((item.quantidade || 0) <= 5) lowStockCount++;
    });
    return { totalProducts: products.length, totalServices: services.length, totalClients: clients.length, totalValue, lowStockCount };
  }, [products, services, clients]);

  const alerts = useMemo(() => {
    const lowStock = products
      .filter(p => (p.quantidade || 0) <= 5)
      .map(p => ({ nome: p.nome, qtd: p.quantidade || 0, valor: (p.preco || 0) * (p.quantidade || 0) }))
      .slice(0, 5);
    return { lowStock };
  }, [products]);

  const statValues = [
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValue),
    stats.totalServices,
    stats.totalClients,
    stats.totalProducts,
  ];
  const statSubtitles = [
    `${stats.totalProducts} produtos`,
    'cadastrados',
    'cadastrados',
    'em estoque',
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STAT_CARDS.map((config, i) => (
          <Grid item xs={6} sm={3} key={config.key}>
            <StatCard
              config={config}
              value={statValues[i]}
              subtitle={statSubtitles[i]}
              onClick={() => onNavigate && onNavigate(config.tab)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Alert tables */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AlertTable
            title="Estoque Crítico"
            icon={TrendingDownIcon}
            iconColor="#ef4444"
            badge={stats.lowStockCount}
          >
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>Qtd</TableCell>
                <TableCell align="right" sx={{ width: 120 }}>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.lowStock.length === 0
                ? <EmptyRow cols={3} text="Estoque dentro do esperado" />
                : alerts.lowStock.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{
                          width: 28, height: 28, borderRadius: 1,
                          bgcolor: alpha('#ef4444', 0.10), color: '#ef4444', fontSize: 14,
                        }}>
                          <InventoryIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nome}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.qtd}
                        size="small"
                        sx={{
                          fontWeight: 700, fontSize: '0.68rem',
                          bgcolor: alpha(item.qtd === 0 ? '#ef4444' : '#f59e0b', 0.10),
                          color: item.qtd === 0 ? '#ef4444' : '#d97706',
                          border: '1px solid', borderColor: alpha(item.qtd === 0 ? '#ef4444' : '#f59e0b', 0.2),
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor || 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </AlertTable>
        </Grid>

        <Grid item xs={12} md={6}>
          <AlertTable
            title="Produtos em Estoque"
            icon={InventoryIcon}
            iconColor="#3b82f6"
            badge={products.length}
          >
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>Qtd</TableCell>
                <TableCell align="right" sx={{ width: 120 }}>Valor Unit.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0
                ? <EmptyRow cols={3} text="Nenhum produto cadastrado" />
                : products.slice(0, 5).map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nome}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantidade ?? 0}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco || 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </AlertTable>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
