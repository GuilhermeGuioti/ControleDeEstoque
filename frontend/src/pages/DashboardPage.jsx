import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { BRAND_GRADIENT } from "../style/theme";

const FMT_BRL = (v) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v || 0);

const PIE_COLORS = [
  "#C9A227",
  "#F5C842",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#6366f1",
];

const STAT_CARDS = [
  {
    key: "revenue",
    title: "Faturamento Hoje",
    icon: TrendingUpIcon,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    shadow: "rgba(16,185,129,0.35)",
    tab: 5,
  },
  {
    key: "salesCount",
    title: "Vendas Hoje",
    icon: ReceiptLongIcon,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    shadow: "rgba(245,158,11,0.35)",
    tab: 5,
  },
  {
    key: "stock",
    title: "Valor em Estoque",
    icon: AttachMoneyIcon,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    shadow: "rgba(59,130,246,0.35)",
    tab: 2,
  },
  {
    key: "clients",
    title: "Clientes",
    icon: PeopleIcon,
    gradient: BRAND_GRADIENT,
    shadow: "rgba(201,162,39,0.35)",
    tab: 4,
  },
];

const StatCard = ({ config, value, subtitle, onClick }) => {
  const Icon = config.icon;
  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        cursor: onClick ? "pointer" : "default",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: `0 16px 32px ${config.shadow}`,
              borderColor: "transparent",
            }
          : {},
      }}
    >
      <Box sx={{ height: 4, background: config.gradient }} />
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
              }}
            >
              {config.title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mt: 0.25, lineHeight: 1.15 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mt: 0.25 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              flexShrink: 0,
              background: config.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 16px ${config.shadow}`,
            }}
          >
            <Icon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ChartCard = (props) => {
  const { title, icon: Icon, iconColor, children, action } = props;
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: alpha(iconColor, 0.12),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color: iconColor, fontSize: 16 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Card>
  );
};

const CustomTooltipBRL = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Typography
          key={i}
          variant="body2"
          sx={{ fontWeight: 700, color: p.color || "text.primary" }}
        >
          {typeof p.value === "number" && p.name !== "qtd"
            ? FMT_BRL(p.value)
            : p.value}
        </Typography>
      ))}
    </Box>
  );
};

const EmptyRow = ({ cols, text }) => (
  <TableRow>
    <TableCell
      colSpan={cols}
      sx={{ textAlign: "center", py: 6, border: "none" }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontStyle: "italic" }}
      >
        {text}
      </Typography>
    </TableCell>
  </TableRow>
);

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

const DashboardPage = ({
  products = [],
  clients = [],
  vendas = [],
  onNavigate,
}) => {
  const theme = useTheme();

  const stats = useMemo(() => {
    let stockValue = 0;
    let lowStockCount = 0;
    products.forEach((p) => {
      stockValue += (p.quantidade || 0) * (p.preco || 0);
      if ((p.quantidade || 0) <= (p.quantidade_minima || 5)) lowStockCount++;
    });
    const vendasHoje = vendas.filter((v) => isToday(v.data_venda));
    const revenueHoje = vendasHoje.reduce(
      (s, v) => s + (v.valor_total || 0),
      0,
    );
    return {
      stockValue,
      lowStockCount,
      totalClients: clients.length,
      salesCount: vendasHoje.length,
      revenueHoje,
    };
  }, [products, clients, vendas]);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
      });
      const dateStr = d.toISOString().split("T")[0];
      const dayVendas = vendas.filter((v) => v.data_venda?.startsWith(dateStr));
      days.push({
        label,
        total: dayVendas.reduce((s, v) => s + (v.valor_total || 0), 0),
        qtd: dayVendas.length,
      });
    }
    return days;
  }, [vendas]);

  const paymentData = useMemo(() => {
    const map = {};
    vendas.forEach((v) => {
      const key = v.forma_pagamento || "Não informado";
      map[key] = (map[key] || 0) + (v.valor_total || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [vendas]);

  const lowStock = useMemo(
    () =>
      products
        .filter((p) => (p.quantidade || 0) <= (p.quantidade_minima || 5))
        .sort((a, b) => (a.quantidade || 0) - (b.quantidade || 0))
        .slice(0, 6),
    [products],
  );

  const recentSales = useMemo(
    () => [...vendas].reverse().slice(0, 5),
    [vendas],
  );

  const statValues = [
    FMT_BRL(stats.revenueHoje),
    stats.salesCount,
    FMT_BRL(stats.stockValue),
    stats.totalClients,
  ];
  const statSubtitles = [
    `${stats.salesCount} venda${stats.salesCount !== 1 ? "s" : ""} hoje`,
    "registradas hoje",
    `${products.length} produtos`,
    "cadastrados",
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
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

      {/* Faturamento | Pagamentos | Estoque Crítico — mesma linha */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Faturamento 7 dias — md=3 */}
        <Grid item xs={12} md={3} width={350}>
          <ChartCard
            title="Faturamento — Últimos 7 Dias"
            icon={TrendingUpIcon}
            iconColor="#10b981"
          >
            <Box sx={{ p: 2, pt: 1.5 }}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={last7Days}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(theme.palette.divider, 0.6)}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v === 0 ? "0" : `R$${(v / 1000).toFixed(0)}k`
                    }
                    tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                  />
                  <ReTooltip content={<CustomTooltipBRL />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Faturamento"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#gradGreen)"
                    dot={{
                      r: 4,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6, fill: "#10b981" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Pagamentos — md=5 */}
        <Grid item xs={12} md={5} width={350}>
          <ChartCard
            title="Pagamentos"
            icon={ReceiptLongIcon}
            iconColor={theme.palette.primary.main}
          >
            <Box sx={{ p: 2, pt: 1.5 }}>
              {paymentData.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 9 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    Sem vendas registradas
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="40%"
                      innerRadius={65}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {paymentData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(v, name) => [FMT_BRL(v), name]}
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.paper,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </ChartCard>
        </Grid>

        {/* Estoque Crítico — md=4 */}
        <Grid item xs={12} md={4} width={350}>
          <ChartCard
            title="Estoque Crítico"
            icon={TrendingDownIcon}
            iconColor="#ef4444"
            action={
              stats.lowStockCount > 0 && (
                <Chip
                  label={stats.lowStockCount}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    bgcolor: alpha("#ef4444", 0.1),
                    color: "#ef4444",
                  }}
                />
              )
            }
          >
            <TableContainer sx={{ maxHeight: 330 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="center" sx={{ width: 64 }}>
                      Qtd
                    </TableCell>
                    <TableCell align="right" sx={{ width: 100 }}>
                      Valor
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStock.length === 0 ? (
                    <EmptyRow cols={3} text="Estoque dentro do esperado" />
                  ) : (
                    lowStock.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 1,
                                bgcolor: alpha("#ef4444", 0.1),
                                color: "#ef4444",
                                fontSize: 14,
                              }}
                            >
                              <InventoryIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {item.nome}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item.quantidade ?? 0}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.68rem",
                              bgcolor: alpha(
                                (item.quantidade ?? 0) === 0
                                  ? "#ef4444"
                                  : "#f59e0b",
                                0.1,
                              ),
                              color:
                                (item.quantidade ?? 0) === 0
                                  ? "#ef4444"
                                  : "#d97706",
                              border: "1px solid",
                              borderColor: alpha(
                                (item.quantidade ?? 0) === 0
                                  ? "#ef4444"
                                  : "#f59e0b",
                                0.2,
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {FMT_BRL(
                              (item.quantidade || 0) * (item.preco || 0),
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Vendas recentes */}
      <ChartCard
        title="Vendas Recentes"
        icon={ShoppingCartIcon}
        iconColor="#f59e0b"
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Venda</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Pagamento</TableCell>
                <TableCell align="center">Itens</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSales.length === 0 ? (
                <EmptyRow cols={5} text="Nenhuma venda registrada" />
              ) : (
                recentSales.map((v, idx) => {
                  const payColor =
                    {
                      PIX: "#10b981",
                      Dinheiro: "#3b82f6",
                      "Cartão de Crédito": "#8b5cf6",
                      "Cartão de Débito": "#6366f1",
                    }[v.forma_pagamento] || "#9ca3af";
                  return (
                    <TableRow key={idx} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          #{String(v.id).padStart(4, "0")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {new Date(v.data_venda).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {v.forma_pagamento ? (
                          <Chip
                            label={v.forma_pagamento}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              bgcolor: alpha(payColor, 0.1),
                              color: payColor,
                              border: "1px solid",
                              borderColor: alpha(payColor, 0.2),
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {v.itens?.length || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, color: "#059669" }}
                        >
                          {FMT_BRL(v.valor_total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ChartCard>
    </Box>
  );
};

export default DashboardPage;
