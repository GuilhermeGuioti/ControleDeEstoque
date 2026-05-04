import React, { useState } from 'react';
import {
  Box, Typography, Stack, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  Collapse, Avatar, CircularProgress, alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PersonIcon from '@mui/icons-material/Person';
import { BRAND_GRADIENT } from '../style/theme';

const FMT_BRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const FMT_DATE = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const PAYMENT_COLORS = {
  'PIX': '#10b981',
  'Dinheiro': '#3b82f6',
  'Cartão de Crédito': '#8b5cf6',
  'Cartão de Débito': '#6366f1',
};

const SaleRow = ({ venda, clients, products, services, onDelete }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const clientName = venda.cliente_id
    ? clients.find(c => c.id === venda.cliente_id)?.nome || `Cliente #${venda.cliente_id}`
    : 'Sem cliente';

  const payColor = PAYMENT_COLORS[venda.forma_pagamento] || theme.palette.text.secondary;

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
          transition: 'background 0.15s',
        }}
      >
        <TableCell sx={{ width: 40, pr: 0 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open
              ? <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'primary.main' }} />
              : <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            }
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            #{String(venda.id).padStart(4, '0')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {FMT_DATE(venda.data_venda)}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 28, height: 28, background: BRAND_GRADIENT, fontSize: '0.75rem' }}>
              {clientName.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{clientName}</Typography>
          </Stack>
        </TableCell>

        <TableCell>
          {venda.forma_pagamento ? (
            <Chip
              label={venda.forma_pagamento}
              size="small"
              sx={{
                fontWeight: 600, fontSize: '0.7rem',
                bgcolor: alpha(payColor, 0.1),
                color: payColor,
                border: '1px solid', borderColor: alpha(payColor, 0.2),
              }}
            />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>—</Typography>
          )}
        </TableCell>

        <TableCell align="center">
          <Chip
            label={`${venda.itens?.length || 0} ${venda.itens?.length === 1 ? 'item' : 'itens'}`}
            size="small"
            sx={{
              fontWeight: 600, fontSize: '0.7rem',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              color: 'primary.main',
            }}
          />
        </TableCell>

        <TableCell align="right">
          <Typography variant="body1" sx={{ fontWeight: 800, color: '#059669' }}>
            {FMT_BRL(venda.valor_total)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Tooltip title="Excluir venda" placement="top">
            <IconButton
              size="small"
              onClick={() => onDelete(venda.id)}
              sx={{
                color: 'error.main',
                '&:hover': { bgcolor: alpha('#ef4444', 0.1), transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Expandable items row */}
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{
              mx: 2, my: 1.5, p: 2, borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
              border: '1px solid', borderColor: 'divider',
            }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', mb: 1, display: 'block' }}>
                Itens da venda
              </Typography>
              <Stack spacing={0.75}>
                {venda.itens?.length > 0 ? venda.itens.map((item, idx) => {
                  const isServico = item.servico_id != null;
                  const nome = isServico
                    ? services.find(s => s.id === item.servico_id)?.nome || `Serviço #${item.servico_id}`
                    : products.find(p => p.id === item.produto_id)?.nome || `Produto #${item.produto_id}`;
                  return (
                    <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{
                          width: 24, height: 24, borderRadius: 1,
                          bgcolor: isServico ? (t) => alpha(t.palette.primary.main, 0.1) : (t) => alpha(t.palette.warning.main, 0.1),
                          color: isServico ? 'primary.main' : 'warning.main',
                          fontSize: 12,
                        }}>
                          {isServico
                            ? <ContentCutIcon sx={{ fontSize: 12 }} />
                            : <ShoppingCartIcon sx={{ fontSize: 12 }} />
                          }
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{nome}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          × {item.quantidade}
                        </Typography>
                        {isServico && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>(serviço)</Typography>
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {FMT_BRL(item.preco_unitario * item.quantidade)}
                      </Typography>
                    </Stack>
                  );
                }) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sem itens registrados</Typography>
                )}
              </Stack>
              {venda.observacao && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    <b>Obs:</b> {venda.observacao}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const VendasPage = ({ vendas = [], clients = [], products = [], services = [], loading = false, onDelete }) => {
  const totalHoje = vendas.filter(v => {
    const d = new Date(v.data_venda);
    const hoje = new Date();
    return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
  });
  const totalGeralHoje = totalHoje.reduce((s, v) => s + (v.valor_total || 0), 0);

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Histórico de Vendas</Typography>
            <Chip
              label={vendas.length}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'action.selected', color: 'primary.main' }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Todas as vendas registradas no sistema
          </Typography>
        </Box>

        {/* Stats rápidos */}
        <Stack direction="row" spacing={2}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Vendas hoje</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
              {totalHoje.length}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Total hoje</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1 }}>
              {FMT_BRL(totalGeralHoje)}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40, pr: 0 }} />
                <TableCell>VENDA</TableCell>
                <TableCell>CLIENTE</TableCell>
                <TableCell>PAGAMENTO</TableCell>
                <TableCell align="center">ITENS</TableCell>
                <TableCell align="right">TOTAL</TableCell>
                <TableCell align="center">AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center', border: 'none' }}>
                    <CircularProgress size={28} sx={{ color: 'primary.main' }} />
                  </TableCell>
                </TableRow>
              ) : vendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center', border: 'none' }}>
                    <Box>
                      <Box sx={{
                        width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 1.5,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ReceiptLongIcon sx={{ color: 'primary.main', fontSize: 24, opacity: 0.5 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Nenhuma venda registrada
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                [...vendas].reverse().map((venda) => (
                  <SaleRow
                    key={venda.id}
                    venda={venda}
                    clients={clients}
                    products={products}
                    services={services}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default VendasPage;
