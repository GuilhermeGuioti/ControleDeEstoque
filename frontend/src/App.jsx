import React, { useState, useEffect, useMemo } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Layout from "./components/Layout";
import GenericPageCrud from "./components/CrudPage/GenericCrudPage";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import VendasPage from "./pages/VendasPage";
import LoginPage from "./pages/LoginPage";
import useCrud from "./hooks/useCrud";
import api from "./services/api";

import getAppTheme from "./style/theme";
import serviceConfig from "./configs/serviceConfig";
import clientConfig from "./configs/clientConfig";
import buildProductConfig from "./configs/productConfig";
import buildLookupConfig from "./configs/lookupConfig";
import buildStockBatchConfig from "./configs/stockBatchConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [mode, setMode] = useState("light");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  // Resumo de estoque por produto (vem de /produtos/estoque/resumo)
  const [estoqueResumo, setEstoqueResumo] = useState([]);

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogin = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const response = await api.post("/login/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("authToken", response.data.access_token);
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab(0);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const notify = (severity, message) => setNotification({ open: true, severity, message });

  // CRUDs primários
  const services = useCrud("/servicos", notify);
  const clients = useCrud("/clientes", notify);
  const products = useCrud("/produtos", notify);
  const vendas = useCrud("/vendas", notify);

  // Tabelas-pivô e movimentações de estoque
  const categorias = useCrud("/categorias", notify);
  const fabricantes = useCrud("/fabricantes", notify);
  const fornecedores = useCrud("/fornecedores", notify);
  const estoques = useCrud("/estoques", notify);

  // /produtos/ não devolve quantidade — quantidade vem de /produtos/estoque/resumo.
  const fetchEstoqueResumo = async () => {
    try {
      const resp = await api.get("/produtos/estoque/resumo");
      setEstoqueResumo(resp.data || []);
    } catch (err) {
      console.warn("Falha ao carregar resumo de estoque:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    products.fetchData();
    services.fetchData();
    clients.fetchData();
    categorias.fetchData();
    fabricantes.fetchData();
    fornecedores.fetchData();
    fetchEstoqueResumo();
    if (currentTab === 6) estoques.fetchData();
    if (currentTab === 0 || currentTab === 5) vendas.fetchData();
  }, [isLoggedIn, currentTab]);

  // Mescla resumo de estoque (quantidade_total) em cada produto para a tabela.
  const productsWithStock = useMemo(() => {
    const byId = new Map(estoqueResumo.map((e) => [e.id_produto, e]));
    return products.data.map((p) => ({
      ...p,
      quantidade_total: byId.get(p.id)?.quantidade_total ?? 0,
    }));
  }, [products.data, estoqueResumo]);

  const productConfig = useMemo(
    () => buildProductConfig({
      categorias: categorias.data,
      fornecedores: fornecedores.data,
      fabricantes: fabricantes.data,
    }),
    [categorias.data, fornecedores.data, fabricantes.data]
  );

  const categoriaConfig = useMemo(
    () => buildLookupConfig({ entityLabel: 'Categoria', placeholder: 'Ex: Shampoo' }),
    []
  );
  const fabricanteConfig = useMemo(
    () => buildLookupConfig({ entityLabel: 'Fabricante', placeholder: 'Ex: L\'Oréal' }),
    []
  );
  const fornecedorConfig = useMemo(
    () => buildLookupConfig({ entityLabel: 'Fornecedor', placeholder: 'Ex: Distribuidora X' }),
    []
  );
  const estoqueConfig = useMemo(
    () => buildStockBatchConfig({ products: products.data }),
    [products.data]
  );

  // O backend tem um validator que XOR id_produto/id_servico — e o estoque é FIFO
  // automático em vendas. Não há rota dedicada de "saída"; para tirar manualmente,
  // o usuário usa a aba Estoque (Lotes). Mantemos o botão de saída rápida criando
  // um lote com quantidade negativa (preco_pago=0 pra não bagunçar o custo médio).
  const handleQuickExit = async (item, quantity) => {
    if (!item?.id || !quantity) return;
    try {
      await api.post("/estoques/", {
        id_produto: item.id,
        quantidade: -Math.abs(quantity),
        preco_pago: 0,
      });
      notify("success", "Saída registrada com sucesso!");
      fetchEstoqueResumo();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : err.message;
      notify("error", `Erro ao registrar saída: ${msg}`);
    }
  };

  const handleNavigate = (tab) => setCurrentTab(tab);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        mode={mode}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      >
        {currentTab === 0 && (
          <DashboardPage
            products={productsWithStock}
            services={services.data}
            clients={clients.data}
            vendas={vendas.data}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 1 && (
          <SalesPage
            products={productsWithStock}
            services={services.data}
            clients={clients.data}
            onSaleComplete={() => { products.fetchData(); vendas.fetchData(); fetchEstoqueResumo(); }}
          />
        )}

        {currentTab === 5 && (
          <VendasPage
            vendas={vendas.data}
            clients={clients.data}
            products={products.data}
            services={services.data}
            loading={vendas.loading}
            onDelete={vendas.handleDelete}
          />
        )}

        {currentTab === 2 && (
          <GenericPageCrud
            title="Produtos"
            subtitle="Catálogo de produtos"
            buttonLabel="Novo Produto"
            searchPlaceholder="Buscar produto..."
            columns={productConfig.columns}
            formFields={productConfig.fields}
            data={productsWithStock}
            onSave={async (payload) => { await products.handleSave(payload); fetchEstoqueResumo(); }}
            onDelete={async (id) => { await products.handleDelete(id); fetchEstoqueResumo(); }}
            onUpdate={async (id, payload) => { await products.handleEdit(id, payload); fetchEstoqueResumo(); }}
            onQuickExit={handleQuickExit}
            showQuickExit={true}
          />
        )}

        {currentTab === 6 && (
          <GenericPageCrud
            title="Estoque"
            subtitle="Lotes de compra (FIFO)"
            buttonLabel="Novo Lote"
            searchPlaceholder="Buscar..."
            columns={estoqueConfig.columns}
            formFields={estoqueConfig.fields}
            data={estoques.data}
            onSave={async (payload) => { await estoques.handleSave(payload); fetchEstoqueResumo(); }}
            onDelete={async (id) => { await estoques.handleDelete(id); fetchEstoqueResumo(); }}
            onUpdate={async (id, payload) => { await estoques.handleEdit(id, payload); fetchEstoqueResumo(); }}
          />
        )}

        {currentTab === 3 && (
          <GenericPageCrud
            title="Serviços"
            subtitle="Catálogo de serviços"
            buttonLabel="Novo Serviço"
            searchPlaceholder="Buscar serviço..."
            columns={serviceConfig.columns}
            formFields={serviceConfig.fields}
            data={services.data}
            onSave={services.handleSave}
            onDelete={services.handleDelete}
            onUpdate={services.handleEdit}
          />
        )}

        {currentTab === 4 && (
          <GenericPageCrud
            title="Clientes"
            subtitle="Cadastro de clientes"
            buttonLabel="Novo Cliente"
            searchPlaceholder="Buscar cliente..."
            columns={clientConfig.columns}
            formFields={clientConfig.fields}
            data={clients.data}
            onSave={clients.handleSave}
            onDelete={clients.handleDelete}
            onUpdate={clients.handleEdit}
          />
        )}

        {currentTab === 7 && (
          <GenericPageCrud
            title="Categorias"
            subtitle="Agrupamentos de produtos"
            buttonLabel="Nova Categoria"
            searchPlaceholder="Buscar categoria..."
            columns={categoriaConfig.columns}
            formFields={categoriaConfig.fields}
            data={categorias.data}
            onSave={categorias.handleSave}
            onDelete={categorias.handleDelete}
            onUpdate={categorias.handleEdit}
          />
        )}

        {currentTab === 8 && (
          <GenericPageCrud
            title="Fabricantes"
            subtitle="Marcas dos produtos"
            buttonLabel="Novo Fabricante"
            searchPlaceholder="Buscar fabricante..."
            columns={fabricanteConfig.columns}
            formFields={fabricanteConfig.fields}
            data={fabricantes.data}
            onSave={fabricantes.handleSave}
            onDelete={fabricantes.handleDelete}
            onUpdate={fabricantes.handleEdit}
          />
        )}

        {currentTab === 9 && (
          <GenericPageCrud
            title="Fornecedores"
            subtitle="Empresas que fornecem os produtos"
            buttonLabel="Novo Fornecedor"
            searchPlaceholder="Buscar fornecedor..."
            columns={fornecedorConfig.columns}
            formFields={fornecedorConfig.fields}
            data={fornecedores.data}
            onSave={fornecedores.handleSave}
            onDelete={fornecedores.handleDelete}
            onUpdate={fornecedores.handleEdit}
          />
        )}

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
