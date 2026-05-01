import React, { useState, useMemo } from 'react';
import {
  Box, Grid, Typography, Stack, TextField, Button, Divider,
  IconButton, InputAdornment, Tabs, Tab, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Paper, alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { BRAND_GRADIENT } from '../style/theme';

const FMT_BRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const SalesPage = ({ products = [], services = [], clients = [], onQuickExit }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const filteredProducts = useMemo(() =>
    products.filter(p => p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) && p.quantidade > 0),
    [products, searchTerm]
  );
  const filteredServices = useMemo(() =>
    services.filter(s => s.nome_servico?.toLowerCase().includes(searchTerm.toLowerCase())),
    [services, searchTerm]
  );
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 10);
    return clients.filter(c =>
      c.nome?.toLowerCase().includes(clientSearch.toLowerCase()) || c.cpf?.includes(clientSearch)
    ).slice(0, 10);
  }, [clients, clientSearch]);

  const cartTotal = useMemo(() => cart.reduce((t, i) => t + i.preco * i.quantidade, 0), [cart]);
  const cartItemsCount = useMemo(() => cart.reduce((t, i) => t + i.quantidade, 0), [cart]);

  const addToCart = (item, type) => {
    const existing = cart.find(i => i.id === item.id && i.type === type);
    if (existing) {
      setCart(cart.map(i => (i.id === item.id && i.type === type) ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      setCart([...cart, {
        id: item.id, nome: item.nome_servico || item.nome,
        preco: item.preco || item.preco_custo || 0,
        quantidade: 1, type, product: item,
      }]);
    }
  };

  const updateQuantity = (id, type, delta) => {
    setCart(cart.map(item => {
      if (item.id === id && item.type === type) {
        const newQty = item.quantidade + delta;
        return newQty > 0 ? { ...item, quantidade: newQty } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const removeFromCart = (id, type) => setCart(cart.filter(i => !(i.id === id && i.type === type)));

  const handleCheckout = () => {
    if (!selectedClient) { alert('Selecione um cliente'); return; }
    cart.filter(i => i.type === 'product').forEach(i => {
      if (onQuickExit) onQuickExit(i.product, i.quantidade);
    });
    setCart([]);
    setSelectedClient(null);
    setIsCheckoutOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>PDV — Ponto de Venda</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Selecione produtos e serviços para finalizar a venda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ReceiptLongIcon />}
          onClick={() => setIsCheckoutOpen(true)}
          disabled={cart.length === 0}
          sx={{ flexShrink: 0 }}
        >
          Finalizar {cartItemsCount > 0 && `(${cartItemsCount})`}
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        {/* Product / Service list */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{
            borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden',
          }}>
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab label="Produtos" icon={<ShoppingCartIcon fontSize="small" />} iconPosition="start" />
                <Tab label="Serviços" icon={<ContentCutIcon fontSize="small" />} iconPosition="start" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder={activeTab === 0 ? 'Buscar produto...' : 'Buscar serviço...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TableContainer sx={{ height: 'calc(100vh - 360px)', minHeight: 280 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>PRODUTO / SERVIÇO</TableCell>
                    <TableCell align="center" sx={{ width: 80 }}>ESTOQUE</TableCell>
                    <TableCell align="right" sx={{ width: 120 }}>PREÇO</TableCell>
                    <TableCell align="center" sx={{ width: 64 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeTab === 0
                    ? filteredProducts.map(product => (
                      <TableRow
                        key={product.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                          '&:last-child td': { border: 'none' },
                        }}
                        onClick={() => addToCart(product, 'product')}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{
                              width: 34, height: 34, borderRadius: 1.5,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main', fontSize: 16,
                            }}>
                              <ShoppingCartIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.nome}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={product.quantidade}
                            size="small"
                            sx={{
                              fontWeight: 700, fontSize: '0.7rem',
                              bgcolor: alpha('#10b981', 0.1),
                              color: '#059669',
                              border: '1px solid', borderColor: alpha('#10b981', 0.2),
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                            {FMT_BRL(product.preco_custo)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); addToCart(product, 'product'); }}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                    : filteredServices.map(service => (
                      <TableRow
                        key={service.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          '&:hover': { bgcolor: alpha('#ec4899', 0.04) },
                          '&:last-child td': { border: 'none' },
                        }}
                        onClick={() => addToCart(service, 'service')}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{
                              width: 34, height: 34, borderRadius: 1.5,
                              bgcolor: alpha('#ec4899', 0.1), color: '#ec4899', fontSize: 16,
                            }}>
                              <ContentCutIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{service.nome_servico}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label="—" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                            {FMT_BRL(service.preco)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); addToCart(service, 'service'); }}
                            sx={{
                              bgcolor: alpha('#ec4899', 0.1), color: '#ec4899',
                              '&:hover': { bgcolor: alpha('#ec4899', 0.2) },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Cart */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{
            borderRadius: 3, border: '1px solid', borderColor: 'divider',
            position: 'sticky', top: 80, overflow: 'hidden',
          }}>
            {/* Cart header */}
            <Box sx={{
              px: 2.5, py: 2,
              background: alpha(theme.palette.primary.main, 0.05),
              borderBottom: '1px solid', borderColor: 'divider',
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: 1.5,
                  background: BRAND_GRADIENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ReceiptLongIcon sx={{ color: '#fff', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                  Carrinho
                </Typography>
                {cartItemsCount > 0 && (
                  <Chip
                    label={cartItemsCount}
                    size="small"
                    sx={{
                      background: BRAND_GRADIENT, color: '#fff',
                      fontWeight: 800, fontSize: '0.75rem',
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Cart items */}
            <Box sx={{ maxHeight: 'calc(100vh - 420px)', minHeight: 200, overflowY: 'auto', px: 2, py: 1.5 }}>
              {cart.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 24, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Carrinho vazio
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                    Clique nos itens para adicionar
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={0}>
                  {cart.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        py: 1.5,
                        borderBottom: idx < cart.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                            {item.nome}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.type === 'product' ? 'Produto' : 'Serviço'} • {FMT_BRL(item.preco)} / un
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id, item.type)}
                          sx={{
                            color: 'text.secondary', p: 0.25, mt: 0.25,
                            '&:hover': { color: 'error.main', bgcolor: alpha('#ef4444', 0.08) },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Stack>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.type, -1)}
                            disabled={item.quantidade <= 1}
                            sx={{
                              width: 28, height: 28,
                              border: '1px solid', borderColor: 'divider', borderRadius: 1.5,
                              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                            }}
                          >
                            <RemoveIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                          <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 28, textAlign: 'center' }}>
                            {item.quantidade}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.type, 1)}
                            sx={{
                              width: 28, height: 28,
                              border: '1px solid', borderColor: 'divider', borderRadius: 1.5,
                              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                            }}
                          >
                            <AddIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>
                          {FMT_BRL(item.preco * item.quantidade)}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Cart footer */}
            {cart.length > 0 && (
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Total ({cartItemsCount} itens)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {FMT_BRL(cartTotal)}
                  </Typography>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => setIsCheckoutOpen(true)}
                  sx={{ py: 1.25 }}
                >
                  Finalizar Venda
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout dialog */}
      <Dialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(6px)' } }
        }}
      >
        <Box sx={{
          p: 3, pb: 2.5,
          background: alpha('#10b981', 0.06),
          borderBottom: '1px solid', borderColor: alpha('#10b981', 0.15),
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }} />
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
            <Box sx={{
              width: 42, height: 42, borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.4)', flexShrink: 0,
            }}>
              <CheckCircleOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Finalizar Venda</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Confirme os dados antes de concluir
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsCheckoutOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {/* Client selector */}
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
            Cliente *
          </Typography>
          <Autocomplete
            options={filteredClients}
            getOptionLabel={(option) => option?.nome || ''}
            onChange={(_, value) => setSelectedClient(value)}
            value={selectedClient}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Stack direction="row" alignItems="center" spacing={1.5} {...props} component="li">
                <Avatar sx={{ width: 32, height: 32, background: BRAND_GRADIENT, fontSize: '0.8rem' }}>
                  {option.nome?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.nome}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>CPF: {option.cpf || '—'}</Typography>
                </Box>
              </Stack>
            )}
          />

          {selectedClient && (
            <Box sx={{
              mt: 1.5, p: 2, borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15),
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ width: 36, height: 36, background: BRAND_GRADIENT, fontSize: '0.85rem', fontWeight: 800 }}>
                  {selectedClient.nome?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedClient.nome}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>CPF: {selectedClient.cpf || '—'}</Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setSelectedClient(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Divider sx={{ my: 2.5 }} />

          {/* Order summary */}
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
              Resumo do pedido
            </Typography>
            <Stack spacing={1}>
              {cart.map((item, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.nome}
                    <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>×{item.quantidade}</Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {FMT_BRL(item.preco * item.quantidade)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669' }}>
                {FMT_BRL(cartTotal)}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
          <Button onClick={() => setIsCheckoutOpen(false)} variant="outlined" sx={{ flex: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            sx={{
              flex: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.45)',
              },
            }}
          >
            Confirmar Venda
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesPage;
