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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
    const hoje = new Date();
    let totalValue = 0;
    let expiringCount = 0;
    let lowStockCount = 0;
    products.forEach(item => {
      totalValue += (item.quantidade || 0) * (item.preco_custo || 0);
      if (item.data_validade) {
        const diffDias = Math.ceil((new Date(item.data_validade) - hoje) / 86400000);
        if (diffDias <= 30) expiringCount++;
      }
      if (item.quantidade_minima && (item.quantidade || 0) <= item.quantidade_minima) lowStockCount++;
    });
    return { totalProducts: products.length, totalServices: services.length, totalClients: clients.length, totalValue, expiringCount, lowStockCount };
  }, [products, services, clients]);

  const alerts = useMemo(() => {
    const hoje = new Date();
    const expiring = [];
    const lowStock = [];
    products.forEach(p => {
      if (p.data_validade) {
        const diffDias = Math.ceil((new Date(p.data_validade) - hoje) / 86400000);
        if (diffDias <= 30) expiring.push({ nome: p.nome, dias: diffDias, valor: (p.preco_custo || 0) * (p.quantidade || 0) });
      }
      if (p.quantidade_minima && p.quantidade <= p.quantidade_minima) {
        lowStock.push({ nome: p.nome, qtd: p.quantidade, min: p.quantidade_minima });
      }
    });
    return { expiring: expiring.slice(0, 5), lowStock: lowStock.slice(0, 5) };
  }, [products]);

  const statValues = [
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValue),
    stats.totalServices,
    stats.totalClients,
    'R$ 0',
  ];
  const statSubtitles = [
    `${stats.totalProducts} produtos`,
    'cadastrados',
    'cadastrados',
    '0 atendimentos',
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
            title="Produtos Vencendo"
            icon={WarningAmberIcon}
            iconColor="#f59e0b"
            badge={stats.expiringCount}
          >
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>Dias</TableCell>
                <TableCell align="right" sx={{ width: 110 }}>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.expiring.length === 0
                ? <EmptyRow cols={3} text="Nenhum produto vencendo em 30 dias" />
                : alerts.expiring.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{
                          width: 28, height: 28, borderRadius: 1,
                          bgcolor: alpha('#f59e0b', 0.12), color: '#f59e0b', fontSize: 14,
                        }}>
                          <InventoryIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nome}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.dias <= 0 ? 'Vencido' : `${item.dias}d`}
                        size="small"
                        sx={{
                          fontWeight: 700, fontSize: '0.68rem',
                          bgcolor: alpha(item.dias <= 0 ? '#ef4444' : '#f59e0b', 0.12),
                          color: item.dias <= 0 ? '#ef4444' : '#d97706',
                          border: '1px solid', borderColor: alpha(item.dias <= 0 ? '#ef4444' : '#f59e0b', 0.2),
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
            title="Estoque Crítico"
            icon={TrendingDownIcon}
            iconColor="#ef4444"
            badge={stats.lowStockCount}
          >
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>Atual</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>Mínimo</TableCell>
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
                          bgcolor: alpha('#ef4444', 0.10),
                          color: '#ef4444',
                          border: '1px solid', borderColor: alpha('#ef4444', 0.2),
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {item.min}
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
