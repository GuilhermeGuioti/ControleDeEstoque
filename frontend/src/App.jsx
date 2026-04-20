import React, { useState, useEffect, useMemo } from "react";
import { Container, Box } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Header from "./components/Header";
import GenericPageCrud from "./components/CrudPage/GenericCrudPage";
import useCrud from "./hooks/useCrud";
import LoginPage from "./pages/LoginPage";

import getAppTheme from "./style/theme";
import serviceConfig from "./configs/serviceConfig";
import clientConfig from "./configs/clientConfig";

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const services = useCrud("/servicos");
  const clients = useCrud("/clientes");

  useEffect(() => {
    if (currentTab === 3) services.fetchData();
    if (currentTab === 4) clients.fetchData();
  }, [currentTab]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Header
          tabValue={currentTab}
          onTabChange={setCurrentTab}
          mode={mode}
          toggleTheme={toggleTheme}
        />

        <Container maxWidth={false} sx={{ mt: 4, pb: 4, px: { xs: 2, md: 5 } }}>
          {currentTab === 3 && (
            <GenericPageCrud
              title="Serviços"
              subtitle="Controla todos os serviços disponibiliados"
              buttonLabel="Adicionar Serviço"
              searchPlaceholder="Buscar serviço"
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
              subtitle="Controla todos os clientes da empresa"
              buttonLabel="Adicionar Cliente"
              searchPlaceholder="Buscar clientes"
              columns={clientConfig.columns}
              formFields={clientConfig.fields}
              data={clients.data}
              onSave={clients.handleSave}
              onDelete={clients.handleDelete}
              onUpdate={clients.handleEdit}
            />
          )}
        </Container>

        {/* <LoginPage/> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
