import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { alpha } from '@mui/material/styles';

const FMT_BRL = (v) =>
   new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

// Tabela /estoques/ = LOTES de compra (FIFO). Cada registro é uma entrada
// no estoque com preço pago próprio — ao vender, o backend debita do mais antigo.
// Schema (EstoqueCreate): id_produto* (UUID), quantidade* (int), preco_pago* (float).
const buildStockBatchConfig = ({ products = [] } = {}) => {
   const productById = new Map(products.map((p) => [p.id, p]));
   return {
      columns: [
         {
            id: 'id_produto',
            label: 'PRODUTO',
            render: (value, row) => {
               const p = productById.get(value);
               return (
                  <Stack direction="row" spacing={2} alignItems="center">
                     <Avatar
                        variant="rounded"
                        sx={{
                           width: 36, height: 36,
                           bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                           color: 'warning.main',
                           borderRadius: '8px',
                           border: '1px solid',
                           borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
                        }}
                     >
                        <Inventory2Icon sx={{ fontSize: '1.2rem' }} />
                     </Avatar>
                     <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.2 }}>
                           {p?.nome || 'Produto removido'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
                           Lote: {String(row.id || '').slice(0, 8)}
                        </Typography>
                     </Box>
                  </Stack>
               );
            },
         },
         {
            id: 'quantidade',
            label: 'QTD',
            align: 'center',
            render: (value) => {
               const n = Number(value) || 0;
               const isOut = n <= 0;
               return (
                  <Chip
                     label={n}
                     size="small"
                     sx={{
                        bgcolor: (theme) => alpha(isOut ? theme.palette.error.main : theme.palette.success.main, 0.12),
                        color: isOut ? 'error.main' : 'success.main',
                        fontWeight: 700, fontSize: '0.75rem',
                        borderRadius: '6px', height: '24px',
                     }}
                  />
               );
            },
         },
         {
            id: 'preco_pago',
            label: 'PREÇO PAGO',
            align: 'left',
            render: (value) => (
               <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                  {FMT_BRL(value)}
               </Typography>
            ),
         },
         {
            id: 'valor_lote',
            label: 'VALOR LOTE',
            align: 'left',
            render: (_, row) => (
               <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                  {FMT_BRL((row.quantidade || 0) * (row.preco_pago || 0))}
               </Typography>
            ),
         },
      ],
      fields: [
         {
            id: 'id_produto', label: 'Produto', type: 'select',
            options: products.map((p) => ({ value: p.id, label: p.nome })),
         },
         { id: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '0' },
         { id: 'preco_pago', label: 'Preço Pago', type: 'text', mask: 'currency', placeholder: 'R$ 0,00' },
      ],
   };
};

export default buildStockBatchConfig;
