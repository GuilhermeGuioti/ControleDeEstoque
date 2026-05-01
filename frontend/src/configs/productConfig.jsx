import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import { alpha } from '@mui/material/styles';

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
                     width: 40, height: 40,
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
                     {row.fornecedor ? `Fornecedor: ${row.fornecedor}` : `ID: ${row.id}`}
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
                  fontWeight: 600, fontSize: '0.7rem',
                  borderRadius: '6px', height: '24px',
               }}
            />
         )
      },
      {
         id: 'quantidade',
         label: 'QTD',
         align: 'center',
         render: (value) => {
            const isCritical = value <= 5;
            return (
               <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{
                     fontWeight: 700, fontSize: '0.875rem',
                     color: isCritical ? 'warning.main' : 'text.primary',
                  }}>
                     {value ?? 0}
                  </Typography>
                  {isCritical && value > 0 && (
                     <Typography sx={{ fontSize: '0.65rem', color: 'warning.main', fontWeight: 600 }}>
                        Estoque baixo
                     </Typography>
                  )}
                  {value === 0 && (
                     <Typography sx={{ fontSize: '0.65rem', color: 'error.main', fontWeight: 600 }}>
                        Esgotado
                     </Typography>
                  )}
               </Box>
            );
         }
      },
      {
         id: 'preco',
         label: 'PREÇO UNIT.',
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
         render: (_, row) => (
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((row.quantidade || 0) * (row.preco || 0))}
            </Typography>
         )
      },
   ],
   fields: [
      { id: 'nome', label: 'Nome do Produto', type: 'text', placeholder: 'Ex: Shampoo Matizador' },
      { id: 'categoria', label: 'Categoria', type: 'text', placeholder: 'Ex: Shampoo, Tintura, Óleo' },
      { id: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '0' },
      { id: 'preco', label: 'Preço (R$)', type: 'number', placeholder: '0.00' },
      { id: 'fornecedor', label: 'Fornecedor', type: 'text', placeholder: 'Ex: Distribuidora X' },
   ],
};

export default productConfig;
