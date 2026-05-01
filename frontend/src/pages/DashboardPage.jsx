import React, { useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory2';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  primary: '#0f172a',
  secondary: '#64748b',
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#10b981', onClick }) => (
  <Card 
    sx={{ 
      borderRadius: 2, 
      border: '1px solid',
      borderColor: 'divider',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      '&:hover': onClick ? { borderColor: color, transform: 'translateY(-2px)' } : {}
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: alpha(color, 0.12) }}>
        <Icon sx={{ color, fontSize: 20 }} />
      </Avatar>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
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
        const validade = new Date(item.data_validade);
        const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
        if (diffDias <= 30) expiringCount++;
      }
      if (item.quantidade_minima && (item.quantidade || 0) <= item.quantidade_minima) {
        lowStockCount++;
      }
    });
    
    return { 
      totalProducts: products.length,
      totalServices: services.length,
      totalClients: clients.length,
      totalValue,
      expiringCount,
      lowStockCount 
    };
  }, [products, services, clients]);

  const alerts = useMemo(() => {
    const hoje = new Date();
    const expiring = [];
    const lowStock = [];
    
    products.forEach(p => {
      if (p.data_validade) {
        const validade = new Date(p.data_validade);
        const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
        if (diffDias <= 30) {
          expiring.push({ nome: p.nome, dias: diffDias, id: p.id, valor: p.preco_custo * p.quantidade });
        }
      }
      if (p.quantidade_minima && p.quantidade <= p.quantidade_minima) {
        lowStock.push({ nome: p.nome, qtd: p.quantidade, min: p.quantidade_minima, id: p.id });
      }
    });
    
    return { expiring: expiring.slice(0, 5), lowStock: lowStock.slice(0, 5) };
  }, [products]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard 
            title="Valor em Estoque"
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValue)}
            subtitle={`${stats.totalProducts} produtos`}
            icon={AttachMoneyIcon}
            color={COLORS.success}
            onClick={() => onNavigate && onNavigate(2)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard 
            title="Serviços"
            value={stats.totalServices}
            subtitle="cadastrados"
            icon={BuildIcon}
            color={COLORS.info}
            onClick={() => onNavigate && onNavigate(3)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard 
            title="Clientes"
            value={stats.totalClients}
            subtitle="cadastrados"
            icon={PeopleIcon}
            color={COLORS.secondary}
            onClick={() => onNavigate && onNavigate(4)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard 
            title="Vendas Hoje"
            value="R$ 0"
            subtitle="0 atendimentos"
            icon={ShoppingCartIcon}
            color={COLORS.warning}
            onClick={() => onNavigate && onNavigate(1)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Produtos Vencendo
              </Typography>
              {stats.expiringCount > 0 && (
                <Chip label={`${stats.expiringCount} itens`} size="small" sx={{ bgcolor: 'warning.main', color: '#fff', fontWeight: 700 }} />
              )}
            </Box>
            <TableContainer sx={{ maxHeight: 250 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>Produto</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center' }}>Dias</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'right' }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.expiring.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        Nenhum item vencendo
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.expiring.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'warning.main', opacity: 0.12, color: 'warning.main' }}>
                              <InventoryIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nome}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Chip label={item.dias <= 0 ? 'Vencido' : `${item.dias}d`} size="small" sx={{ bgcolor: item.dias <= 0 ? 'error.main' : 'warning.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Estoque Baixo
              </Typography>
              <Chip label={stats.lowStockCount} size="small" sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 700 }} />
            </Box>
            <TableContainer sx={{ maxHeight: 250 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>Produto</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center' }}>Atual</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'center' }}>Mín</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.lowStock.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        Estoque normal
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.lowStock.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'error.main', opacity: 0.12, color: 'error.main' }}>
                              <InventoryIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nome}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Chip label={item.qtd} size="small" sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
                          {item.min}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;