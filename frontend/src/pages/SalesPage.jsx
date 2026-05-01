import React, { useState, useMemo } from 'react';
import { Box, Grid, Typography, Stack, TextField, Button, Divider, IconButton, InputAdornment, Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BuildIcon from '@mui/icons-material/Build';

const COLORS = {
  primary: '#0f172a',
  info: '#3b82f6',
  success: '#10b981',
  error: '#ef4444',
};

const SalesPage = ({ products = [], services = [], clients = [], onQuickExit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) && p.quantidade > 0
    );
  }, [products, searchTerm]);

  const filteredServices = useMemo(() => {
    return services.filter(s => s.nome_servico?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [services, searchTerm]);

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 10);
    return clients.filter(c => 
      c.nome?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.cpf?.includes(clientSearch)
    ).slice(0, 10);
  }, [clients, clientSearch]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantidade, 0);
  }, [cart]);

  const addToCart = (item, type) => {
    const existing = cart.find(i => i.id === item.id && i.type === type);
    if (existing) {
      setCart(cart.map(i => 
        (i.id === item.id && i.type === type) ? { ...i, quantidade: i.quantidade + 1 } : i
      ));
    } else {
      setCart([...cart, { 
        id: item.id, 
        nome: item.nome_servico || item.nome, 
        preco: item.preco || item.preco_custo || 0, 
        quantidade: 1, 
        type,
        product: item
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

  const removeFromCart = (id, type) => {
    setCart(cart.filter(item => !(item.id === id && item.type === type)));
  };

  const handleCheckout = () => {
    if (!selectedClient) {
      alert('Selecione um cliente');
      return;
    }
    cart.filter(item => item.type === 'product').forEach(item => {
      if (onQuickExit) onQuickExit(item.product, item.quantidade);
    });
    setCart([]);
    setSelectedClient(null);
    setIsCheckoutOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>PDV - Ponto de Venda</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Selecione os produtos e finalize a venda</Typography>
        </Box>
        <Button variant="contained" onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0} sx={{ bgcolor: COLORS.success }}>
          Finalizar ({cartItemsCount})
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Produtos" />
                <Tab label="Serviços" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder={activeTab === 0 ? "Buscar produto..." : "Buscar serviço..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
              />
            </Box>
            <TableContainer sx={{ height: 'calc(100vh - 340px)', minHeight: 300 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>PRODUTO/SERVIÇO</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, width: 100 }}>EST</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, width: 120 }}>PREÇO</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, width: 80 }}>AÇÃO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeTab === 0 ? filteredProducts.map(product => (
                    <TableRow hover key={product.id} sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha(COLORS.primary, 0.04) } }} onClick={() => addToCart(product, 'product')}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: alpha(COLORS.primary, 0.12), color: COLORS.primary }}>
                            <ShoppingCartIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.nome}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={product.quantidade} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.success }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_custo || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" sx={{ color: COLORS.success }} onClick={(e) => { e.stopPropagation(); addToCart(product, 'product'); }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )) : filteredServices.map(service => (
                    <TableRow hover key={service.id} sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha(COLORS.info, 0.04) } }} onClick={() => addToCart(service, 'service')}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: alpha(COLORS.info, 0.12), color: COLORS.info }}>
                            <BuildIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{service.nome_servico}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="-" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.success }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.preco || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" sx={{ color: COLORS.success }} onClick={(e) => { e.stopPropagation(); addToCart(service, 'service'); }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 20 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ReceiptLongIcon sx={{ color: COLORS.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>Carrinho</Typography>
                <Chip label={cartItemsCount} size="small" sx={{ bgcolor: COLORS.primary, color: '#fff', fontWeight: 700 }} />
              </Stack>
            </Box>
            <Box sx={{ p: 2, maxHeight: 'calc(100vh - 380px)', minHeight: 250, overflow: 'auto' }}>
              {cart.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Carrinho vazio</Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {cart.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{item.nome}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.type}</Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.type, -1)} disabled={item.quantidade <= 1}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantidade}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.type, 1)}><AddIcon fontSize="small" /></IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.success, minWidth: 70, textAlign: 'right' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.id, item.type)}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
            {cart.length > 0 && (
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}</Typography>
                </Stack>
                <Button fullWidth variant="contained" onClick={() => setIsCheckoutOpen(true)} sx={{ bgcolor: COLORS.success }}>
                  Finalizar Venda
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: COLORS.success }}><CheckCircleIcon /></Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Finalizar Venda</Typography>
            <Chip label={cartItemsCount} size="small" sx={{ bgcolor: COLORS.primary, color: '#fff' }} />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Cliente *</Typography>
          <Autocomplete 
            options={filteredClients} 
            getOptionLabel={(option) => option?.nome || ''} 
            onChange={(e, value) => setSelectedClient(value)} 
            value={selectedClient}
            renderInput={(params) => (
              <TextField {...params} placeholder="Buscar cliente..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} />
            )}
            renderOption={(props, option) => (
              <Stack direction="row" alignItems="center" spacing={2} {...props}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary }}>{option.nome?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.nome}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>CPF: {option.cpf || '-'}</Typography>
                </Box>
              </Stack>
            )}
          />
          {selectedClient && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: COLORS.primary }}>{selectedClient.nome?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedClient.nome}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>CPF: {selectedClient.cpf || '-'}</Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setSelectedClient(null)}><CloseIcon fontSize="small" /></IconButton>
            </Box>
          )}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            {cart.map((item, idx) => (
              <Stack key={idx} direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">{item.nome} x{item.quantidade}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.success }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setIsCheckoutOpen(false)} variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>Cancelar</Button>
          <Button onClick={handleCheckout} variant="contained" sx={{ borderRadius: 2, flex: 1, bgcolor: COLORS.success }}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesPage;