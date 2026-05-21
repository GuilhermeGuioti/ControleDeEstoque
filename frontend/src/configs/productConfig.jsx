import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import { alpha } from '@mui/material/styles';

// productConfig é uma factory: recebe as listas de categorias/fornecedores/fabricantes
// para popular os <select> dos campos id_categoria/id_fornecedor/id_fabricante.
// Backend (ProdutoCreate): nome*, preco*, descricao?, id_categoria?, id_fornecedor?,
//   id_fabricante?, quantidade_minima?, data_validade?, observacoes?
// Quantidade em estoque vem separada de /produtos/estoque/resumo e é mesclada no App.
const buildProductConfig = ({ categorias = [], fornecedores = [], fabricantes = [] } = {}) => ({
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
                     {row.fornecedor?.nome ? `Fornecedor: ${row.fornecedor.nome}` : `ID: ${String(row.id || '').slice(0, 8)}`}
                  </Typography>
               </Box>
            </Stack>
         )
      },
      {
         id: 'categoria',
         label: 'CATEGORIA',
         align: 'left',
         render: (_, row) => (
            <Chip
               label={row.categoria?.nome || 'Sem categoria'}
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
         render: (_, row) => {
            const qtd = row.quantidade_total ?? 0;
            const minimo = row.quantidade_minima ?? 0;
            const isCritical = minimo > 0 && qtd <= minimo;
            return (
               <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{
                     fontWeight: 700, fontSize: '0.875rem',
                     color: isCritical ? 'warning.main' : 'text.primary',
                  }}>
                     {qtd}
                  </Typography>
                  {isCritical && qtd > 0 && (
                     <Typography sx={{ fontSize: '0.65rem', color: 'warning.main', fontWeight: 600 }}>
                        Estoque baixo
                     </Typography>
                  )}
                  {qtd === 0 && (
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
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((row.quantidade_total || 0) * (row.preco || 0))}
            </Typography>
         )
      },
   ],
   fields: [
      { id: 'nome', label: 'Nome do Produto', type: 'text', placeholder: 'Ex: Shampoo Matizador' },
      { id: 'descricao', label: 'Descrição', type: 'text', placeholder: 'Breve descrição', multiline: true },
      { id: 'preco', label: 'Preço', type: 'text', mask: 'currency', placeholder: 'R$ 0,00' },
      {
         id: 'id_categoria', label: 'Categoria', type: 'select',
         options: categorias.map((c) => ({ value: c.id, label: c.nome })),
      },
      {
         id: 'id_fornecedor', label: 'Fornecedor', type: 'select',
         options: fornecedores.map((f) => ({ value: f.id, label: f.nome })),
      },
      {
         id: 'id_fabricante', label: 'Fabricante', type: 'select',
         options: fabricantes.map((f) => ({ value: f.id, label: f.nome })),
      },
      { id: 'quantidade_minima', label: 'Estoque Mínimo', type: 'number', placeholder: '0' },
      { id: 'data_validade', label: 'Data de Validade', type: 'date' },
      { id: 'observacoes', label: 'Observações', type: 'text', placeholder: 'Notas internas', multiline: true },
   ],
});

export default buildProductConfig;
