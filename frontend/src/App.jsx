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
import productConfig from "./configs/productConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [mode, setMode] = useState("light");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogin = async (username, password) => {
    // TODO: reativar quando o backend tiver um usuário cadastrado
    // const formData = new URLSearchParams();
    // formData.append("username", username);
    // formData.append("password", password);
    // const response = await api.post("/login/token", formData, {
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // });
    // localStorage.setItem("authToken", response.data.access_token);
    if (!username || !password) throw new Error("Preencha email e senha");
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
    const loggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("authToken");
    if (loggedIn === "true" && token) setIsLoggedIn(true);
  }, []);

  const notify = (severity, message) => setNotification({ open: true, severity, message });

  const services = useCrud("/servicos", notify);
  const clients = useCrud("/clientes", notify);
  const products = useCrud("/produtos", notify);
  const vendas = useCrud("/vendas", notify);

  useEffect(() => {
    if (!isLoggedIn) return;
    products.fetchData();
    services.fetchData();
    clients.fetchData();
    if (currentTab === 5) vendas.fetchData();
  }, [isLoggedIn, currentTab]);

  const handleQuickExit = (item, quantity) => {
    if (item && item.id) {
      const newQuantity = Math.max(0, (item.quantidade || 0) - quantity);
      products.handleEdit(item.id, { ...item, quantidade: newQuantity });
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
            products={products.data}
            services={services.data}
            clients={clients.data}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 1 && (
          <SalesPage
            products={products.data}
            services={services.data}
            clients={clients.data}
            onSaleComplete={() => { products.fetchData(); vendas.fetchData(); }}
          />
        )}

        {currentTab === 5 && (
          <VendasPage
            vendas={vendas.data}
            clients={clients.data}
            products={products.data}
            loading={vendas.loading}
            onDelete={vendas.handleDelete}
          />
        )}

        {currentTab === 2 && (
          <GenericPageCrud
            title="Estoque"
            subtitle="Gerencie os produtos do salão"
            buttonLabel="Novo Produto"
            searchPlaceholder="Buscar produto..."
            columns={productConfig.columns}
            formFields={productConfig.fields}
            data={products.data}
            onSave={products.handleSave}
            onDelete={products.handleDelete}
            onUpdate={products.handleEdit}
            onQuickExit={handleQuickExit}
            showQuickExit={true}
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
