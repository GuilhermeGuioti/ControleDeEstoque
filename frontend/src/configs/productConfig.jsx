import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { alpha } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getValidityStatus = (dataValidade) => {
   if (!dataValidade) return { status: 'sem_data', label: 'Sem data', color: 'default', icon: null };
   
   const hoje = new Date();
   const validade = new Date(dataValidade);
   const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
   
   if (diffDias < 0) return { status: 'vencido', label: 'Vencido', color: 'error', icon: <ErrorIcon sx={{ fontSize: 16 }} /> };
   if (diffDias <= 30) return { status: 'proximo', label: `${diffDias} dias`, color: 'warning', icon: <WarningIcon sx={{ fontSize: 16 }} /> };
   return { status: 'ok', label: `${diffDias} dias`, color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
};

const getStockStatus = (quantidade, quantidadeMinima) => {
   if (!quantidadeMinima || quantidadeMinima === 0) return { status: 'ok', label: 'Normal', color: 'success' };
   if (quantidade <= quantidadeMinima) return { status: 'baixo', label: 'Estoque baixo', color: 'warning' };
   if (quantidade === 0) return { status: 'esgotado', label: 'Esgotado', color: 'error' };
   return { status: 'ok', label: 'Normal', color: 'success' };
};

const productConfig = {
   statsIcon: InventoryIcon,
   columns: [
      {
         id: 'nome',
         label: 'PRODUTO',
         render: (value, row) => (
            <Stack direction="row" spacing={2} alignItems="center">
               <Avatar
                  variant="rounded"
                  sx={{
                     width: 40,
                     height: 40,
                     bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                     color: 'warning.main',
                     borderRadius: '8px',
                     border: '1px solid',
                     borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
                  }}
               >
                  <InventoryIcon sx={{ fontSize: '1.3rem' }} />
               </Avatar>
               <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.2 }}>
                     {value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
                     SKU-{row.id}
                  </Typography>
               </Box>
            </Stack>
         )
      },
      {
         id: 'categoria',
         label: 'CATEGORIA',
         align: 'left',
         render: (value) => (
            <Chip
               label={value || 'Sem categoria'}
               size="small"
               sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  borderRadius: '6px',
                  height: '24px'
               }}
            />
         )
      },
      {
         id: 'quantidade',
         label: 'QTD',
         align: 'center',
         render: (value, row) => {
            const stockStatus = getStockStatus(value, row.quantidade_minima);
            return (
               <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                     fontWeight: 700, 
                     fontSize: '0.875rem', 
                     color: stockStatus.color === 'error' ? 'error.main' : stockStatus.color === 'warning' ? 'warning.main' : 'text.primary'
                  }}>
                     {value}
                  </Typography>
                  {stockStatus.status !== 'ok' && (
                     <Typography sx={{ fontSize: '0.65rem', color: stockStatus.color === 'error' ? 'error.main' : 'warning.main', fontWeight: 600 }}>
                        {stockStatus.label}
                     </Typography>
                  )}
               </Box>
            );
         }
      },
      {
         id: 'data_validade',
         label: 'VALIDADE',
         align: 'left',
         render: (value) => {
            const validityStatus = getValidityStatus(value);
            return (
               <Stack direction="row" alignItems="center" spacing={1}>
                  {validityStatus.icon}
                  <Typography sx={{ 
                     color: validityStatus.color === 'error' ? 'error.main' : validityStatus.color === 'warning' ? 'warning.main' : 'text.secondary', 
                     fontSize: '0.875rem', 
                     fontWeight: 500 
                  }}>
                     {value ? new Date(value).toLocaleDateString('pt-BR') : 'Sem data'}
                  </Typography>
               </Stack>
            );
         }
      },
      {
         id: 'preco_custo',
         label: 'CUSTO UNIT.',
         align: 'left',
         render: (value) => (
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)}
            </Typography>
         )
      },
      {
         id: 'valor_total',
         label: 'VALOR TOTAL',
         align: 'left',
         render: (value, row) => (
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((row.quantidade || 0) * (row.preco_custo || 0))}
            </Typography>
         )
      }
   ],
   fields: [
      { id: 'nome', label: 'Nome do Produto', type: 'text', placeholder: 'Ex: Shampoo Matizador', halfWidth: false },
      { id: 'categoria', label: 'Categoria', type: 'text', placeholder: 'Ex: Shampoo, Tintura, Óleo', halfWidth: true },
      { id: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '0', halfWidth: true },
      { id: 'quantidade_minima', label: 'Estoque Mínimo', type: 'number', placeholder: 'Alerta quando atingir', halfWidth: true },
      { id: 'preco_custo', label: 'Preço de Custo (R$)', type: 'number', placeholder: '0.00', halfWidth: true },
      { id: 'data_validade', label: 'Data de Validade', type: 'date', halfWidth: true }
   ],
   quickExitFields: [
      { id: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '1', halfWidth: false }
   ]
};

export default productConfig;