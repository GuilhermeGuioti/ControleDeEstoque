import React, { useState, useEffect, useMemo} from 'react';
import { Container, Box } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';

import Header from "./components/Header";
import GenericPageCrud from "./components/CrudPage/GenericCrudPage"
import useCrud  from './hooks/useCrud';
import LoginPage from './pages/LoginPage';

import getAppTheme from "./style/theme";
import serviceConfig from "./configs/serviceConfig"

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const [mode, setMode] = useState('light');
  
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  const services = useCrud('/servicos');

  useEffect(() => {
    if (currentTab === 3) services.fetchData();
  }, [currentTab]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header tabValue={currentTab} onTabChange={setCurrentTab} mode={mode} toggleTheme={toggleTheme}/>
        
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
        </Container>

        {/* <LoginPage/> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;