import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Stack, TextField, Button, Divider, IconButton,
  InputAdornment, Tabs, Tab, Chip, Dialog, DialogContent, DialogActions,
  Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Avatar, Paper, MenuItem, Alert, CircularProgress, alpha,
  Fab, Drawer, useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import { BRAND_GRADIENT } from "../style/theme";
import api from "../services/api";

const FMT_BRL = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const FORMAS_PAGAMENTO = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX", "Outro"];

const SalesPage = ({ products = [], services = [], clients = [], onSaleComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) && p.quantidade > 0),
    [products, searchTerm]
  );
  const filteredServices = useMemo(
    () => services.filter((s) => s.nome?.toLowerCase().includes(searchTerm.toLowerCase())),
    [services, searchTerm]
  );
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 10);
    return clients
      .filter((c) => c.nome?.toLowerCase().includes(clientSearch.toLowerCase()) || c.cpf?.includes(clientSearch))
      .slice(0, 10);
  }, [clients, clientSearch]);

  const cartTotal = useMemo(() => cart.reduce((t, i) => t + i.preco * i.quantidade, 0), [cart]);
  const cartItemsCount = useMemo(() => cart.reduce((t, i) => t + i.quantidade, 0), [cart]);

  const addToCart = (item, type) => {
    const existing = cart.find((i) => i.id === item.id && i.type === type);
    if (existing) {
      setCart(cart.map((i) => i.id === item.id && i.type === type ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      setCart([...cart, { id: item.id, nome: item.nome, preco: item.preco || 0, quantidade: 1, type, product: item }]);
    }
  };

  const updateQuantity = (id, type, delta) => {
    setCart(
      cart.map((item) => {
        if (item.id === id && item.type === type) {
          const newQty = item.quantidade + delta;
          return newQty > 0 ? { ...item, quantidade: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantidade > 0)
    );
  };

  const removeFromCart = (id, type) => setCart(cart.filter((i) => !(i.id === id && i.type === type)));

  const handleCheckout = async () => {
    setCheckoutError("");
    if (cart.length === 0) {
      setCheckoutError("Adicione pelo menos um item ao carrinho para registrar a venda.");
      return;
    }
    const payload = {
      cliente_id: selectedClient?.id || null,
      forma_pagamento: formaPagamento || null,
      itens: cart.map((i) => ({
        ...(i.type === "product" ? { produto_id: i.id } : { servico_id: i.id }),
        quantidade: i.quantidade,
        preco_unitario: i.preco,
      })),
    };
    setIsSubmitting(true);
    try {
      await api.post("/vendas/", payload);
      setCart([]);
      setSelectedClient(null);
      setFormaPagamento("");
      setIsCheckoutOpen(false);
      setCartDrawerOpen(false);
      onSaleComplete?.();
    } catch (err) {
      setCheckoutError(err.response?.data?.detail || "Erro ao registrar venda. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared cart content (used in both sidebar and bottom drawer)
  const CartContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Cart items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, minHeight: 0, maxHeight: { xs: "45vh", md: "none" } }}>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: "50%", mx: "auto", mb: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShoppingCartIcon sx={{ color: "primary.main", fontSize: 24, opacity: 0.5 }} />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>Carrinho vazio</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.7 }}>
              {isMobile ? "Toque nos itens para adicionar" : "Clique nos itens para adicionar"}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {cart.map((item, idx) => (
              <Box key={idx} sx={{
                py: 1.5,
                borderBottom: idx < cart.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{item.nome}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {item.type === "product" ? "Produto" : "Serviço"} • {FMT_BRL(item.preco)} / un
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeFromCart(item.id, item.type)}
                    sx={{ color: "text.secondary", p: 0.25, mt: 0.25, "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.08) } }}
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
                      sx={{ width: 28, height: 28, border: "1px solid", borderColor: "divider", borderRadius: 1.5, "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                    >
                      <RemoveIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 28, textAlign: "center" }}>{item.quantidade}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.type, 1)}
                      sx={{ width: 28, height: 28, border: "1px solid", borderColor: "divider", borderRadius: 1.5, "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#059669" }}>
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
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
              Total ({cartItemsCount} itens)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{FMT_BRL(cartTotal)}</Typography>
          </Stack>
          <Button
            fullWidth variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => setIsCheckoutOpen(true)}
            sx={{ py: 1.25 }}
          >
            Finalizar Venda
          </Button>
        </Box>
      )}
    </Box>
  );

  const ItemRow = ({ item, type }) => (
    <TableRow
      hover
      sx={{
        cursor: "pointer",
        transition: "background 0.15s",
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        "&:last-child td": { border: "none" },
      }}
      onClick={() => addToCart(item, type)}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{
            width: { xs: 28, sm: 34 }, height: { xs: 28, sm: 34 },
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}>
            {type === "product"
              ? <ShoppingCartIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              : <ContentCutIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            }
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            {item.nome}
          </Typography>
        </Stack>
      </TableCell>
      {type === "product" && (
        <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
          <Chip
            label={item.quantidade}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem", bgcolor: alpha("#10b981", 0.1), color: "#059669", border: "1px solid", borderColor: alpha("#10b981", 0.2) }}
          />
        </TableCell>
      )}
      {type === "service" && (
        <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
          <Chip label="—" size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
        </TableCell>
      )}
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#059669" }}>
          {FMT_BRL(item.preco)}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 48 }}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); addToCart(item, type); }}
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{
      display: "flex", flexDirection: "column",
      height: { xs: "auto", md: "calc(100vh - 112px)" },
      overflow: { xs: "visible", md: "hidden" },
      pb: { xs: 2, md: 0 },
    }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "flex-end" }, flexShrink: 0, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", sm: "2.125rem" } }}>
            PDV — Ponto de Venda
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Selecione produtos e serviços para finalizar a venda
          </Typography>
        </Box>
        {/* Desktop finalize button */}
        <Button
          variant="contained"
          startIcon={<ReceiptLongIcon />}
          onClick={() => setIsCheckoutOpen(true)}
          disabled={cart.length === 0}
          sx={{ flexShrink: 0, display: { xs: "none", md: "flex" } }}
        >
          Finalizar {cartItemsCount > 0 && `(${cartItemsCount})`}
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ flex: 1, minHeight: 0 }}>
        {/* Product / Service list */}
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Paper elevation={0} sx={{
            flex: 1,
            borderRadius: 3,
            border: "1px solid", borderColor: "divider",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            maxHeight: { xs: 420, md: "none" },
            minHeight: { xs: 300, md: 0 },
          }}>
            <Box sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2, flexShrink: 0 }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab
                  label="Produtos"
                  icon={<ShoppingCartIcon fontSize="small" />}
                  iconPosition="start"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, minHeight: 48 }}
                />
                <Tab
                  label="Serviços"
                  icon={<ContentCutIcon fontSize="small" />}
                  iconPosition="start"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, minHeight: 48 }}
                />
              </Tabs>
            </Box>
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
              <TextField
                fullWidth size="small"
                placeholder={activeTab === 0 ? "Buscar produto..." : "Buscar serviço..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TableContainer sx={{ flex: 1, minHeight: 0, overflowX: "auto" }}>
              <Table size="small" stickyHeader sx={{ minWidth: { xs: 280, sm: "auto" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{activeTab === 0 ? "PRODUTO" : "SERVIÇO"}</TableCell>
                    <TableCell align="center" sx={{ width: 80, display: { xs: "none", sm: "table-cell" } }}>ESTOQUE</TableCell>
                    <TableCell align="right" sx={{ width: 100 }}>PREÇO</TableCell>
                    <TableCell align="center" sx={{ width: 48 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeTab === 0
                    ? filteredProducts.map((product) => <ItemRow key={product.id} item={product} type="product" />)
                    : filteredServices.map((service) => <ItemRow key={service.id} item={service} type="service" />)
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Desktop Cart sidebar */}
        {!isMobile && (
          <Grid item md={6} sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", minHeight: 0, width: 600 }}>
            <Paper elevation={0} sx={{
              flex: 1,
              borderRadius: 3,
              border: "1px solid", borderColor: "divider",
              overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              {/* Cart header */}
              <Box sx={{
                px: 2.5, py: 2, flexShrink: 0,
                background: alpha(theme.palette.primary.main, 0.05),
                borderBottom: "1px solid", borderColor: "divider",
              }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: BRAND_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ReceiptLongIcon sx={{ color: "#fff", fontSize: 16 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Carrinho</Typography>
                  {cartItemsCount > 0 && (
                    <Chip label={cartItemsCount} size="small" sx={{ background: BRAND_GRADIENT, color: "#fff", fontWeight: 800, fontSize: "0.75rem" }} />
                  )}
                </Stack>
              </Box>
              <CartContent />
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Mobile: Floating Cart FAB */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setCartDrawerOpen(true)}
          sx={{
            position: "fixed",
            bottom: 72,
            right: 16,
            zIndex: 1200,
            background: BRAND_GRADIENT,
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <ShoppingCartIcon />
            {cartItemsCount > 0 && (
              <Box sx={{
                position: "absolute",
                top: -8, right: -10,
                bgcolor: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: 18, height: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 800,
              }}>
                {cartItemsCount}
              </Box>
            )}
          </Box>
        </Fab>
      )}

      {/* Mobile: Cart Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            height: "65vh",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          }
        }}
      >
        {/* Drawer handle */}
        <Box sx={{ pt: 1.5, pb: 0.5, display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: "divider" }} />
        </Box>

        {/* Cart header */}
        <Box sx={{
          px: 2.5, py: 1.5, flexShrink: 0,
          background: alpha(theme.palette.primary.main, 0.05),
          borderBottom: "1px solid", borderColor: "divider",
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: BRAND_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ReceiptLongIcon sx={{ color: "#fff", fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Carrinho</Typography>
            {cartItemsCount > 0 && (
              <Chip label={cartItemsCount} size="small" sx={{ background: BRAND_GRADIENT, color: "#fff", fontWeight: 800 }} />
            )}
            <IconButton size="small" onClick={() => setCartDrawerOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Cart items — scrollable */}
        <Box sx={{ overflowY: "auto", px: 2, py: 1.5, flexShrink: 1, flexGrow: 1 }}>
          {cart.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <ShoppingCartIcon sx={{ fontSize: 40, color: "text.secondary", opacity: 0.3, mb: 1 }} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Carrinho vazio</Typography>
              <Typography variant="caption" component="div" sx={{ color: "text.secondary", opacity: 0.7 }}>
                Toque nos itens para adicionar
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0}>
              {cart.map((item, idx) => (
                <Box key={idx} sx={{
                  py: 1.5,
                  borderBottom: idx < cart.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}>
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{item.nome}</Typography>
                      <Typography variant="caption" component="div" sx={{ color: "text.secondary" }}>
                        {item.type === "product" ? "Produto" : "Serviço"} • {FMT_BRL(item.preco)} / un
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.id, item.type)}
                      sx={{ color: "text.secondary", p: 0.25, mt: 0.25 }}
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
                        sx={{ width: 28, height: 28, border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}
                      >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 28, textAlign: "center" }}>{item.quantidade}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.type, 1)}
                        sx={{ width: 28, height: 28, border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#059669" }}>
                      {FMT_BRL(item.preco * item.quantidade)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer — always visible at bottom */}
        {cart.length > 0 && (
          <Box sx={{ p: 2, pb: 8, borderTop: "1px solid", borderColor: "divider", flexShrink: 0, bgcolor: "background.paper" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                Total ({cartItemsCount} {cartItemsCount === 1 ? "item" : "itens"})
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{FMT_BRL(cartTotal)}</Typography>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => { setCartDrawerOpen(false); setIsCheckoutOpen(true); }}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Finalizar Venda
            </Button>
          </Box>
        )}
      </Drawer>

      {/* Checkout dialog */}
      <Dialog
        open={isCheckoutOpen}
        onClose={() => { setIsCheckoutOpen(false); setCheckoutError(""); }}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        slotProps={{ backdrop: { sx: { backdropFilter: "blur(6px)" } } }}
      >
        <Box sx={{
          p: { xs: 2.5, sm: 3 }, pb: 2.5,
          background: alpha("#10b981", 0.06),
          borderBottom: "1px solid", borderColor: alpha("#10b981", 0.15),
          position: "relative", overflow: "hidden",
        }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }} />
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
            <Box sx={{
              width: 42, height: 42, borderRadius: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,0.4)", flexShrink: 0,
            }}>
              <CheckCircleOutlineIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Finalizar Venda</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Confirme os dados antes de concluir</Typography>
            </Box>
            <IconButton size="small" onClick={() => { setIsCheckoutOpen(false); setCheckoutError(""); }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {checkoutError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setCheckoutError("")}>
              {checkoutError}
            </Alert>
          )}

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>Cliente</Typography>
          <Autocomplete
            options={filteredClients}
            getOptionLabel={(option) => option?.nome || ""}
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
                      <PersonIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Stack direction="row" alignItems="center" spacing={1.5} {...props} component="li">
                <Avatar sx={{ width: 32, height: 32, background: BRAND_GRADIENT, fontSize: "0.8rem" }}>
                  {option.nome?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.nome}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>CPF: {option.cpf || "—"}</Typography>
                </Box>
              </Stack>
            )}
          />

          {selectedClient && (
            <Box sx={{
              mt: 1.5, p: 2, borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: "1px solid", borderColor: alpha(theme.palette.primary.main, 0.15),
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ width: 36, height: 36, background: BRAND_GRADIENT, fontSize: "0.85rem", fontWeight: 800 }}>
                  {selectedClient.nome?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedClient.nome}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>CPF: {selectedClient.cpf || "—"}</Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setSelectedClient(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>Forma de Pagamento</Typography>
          <TextField
            select fullWidth
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            size="medium"
          >
            <MenuItem value="">Não informar</MenuItem>
            {FORMAS_PAGAMENTO.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </TextField>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="overline" sx={{ color: "text.secondary", mb: 1.5, display: "block" }}>Resumo do pedido</Typography>
            <Stack spacing={1}>
              {cart.map((item, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.nome}
                    <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>×{item.quantidade}</Typography>
                    {item.type === "service" && (
                      <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>(serviço)</Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{FMT_BRL(item.preco * item.quantidade)}</Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#059669" }}>{FMT_BRL(cartTotal)}</Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider", gap: 1 }}>
          <Button
            onClick={() => { setIsCheckoutOpen(false); setCheckoutError(""); }}
            variant="outlined" sx={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              flex: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 6px 20px rgba(16,185,129,0.45)" },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.8)" }} /> : "Confirmar Venda"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesPage;