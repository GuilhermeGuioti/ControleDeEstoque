import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCutTwoTone';
import { alpha } from '@mui/material/styles';

const serviceConfig = {
   columns: [
      {
         id: 'nome_servico',
         label: 'SERVIÇO',
         render: (value, row) => (
            <Stack direction="row" spacing={2} alignItems="center">
               <Avatar
                  variant="rounded"
                  sx={{
                     width: 40,
                     height: 40,
                     bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                     color: 'primary.main',
                     borderRadius: '8px',
                     border: '1px solid',
                     borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  }}
               >
                  <ContentCutIcon sx={{ fontSize: '1.3rem' }} />
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
         id: 'preco', 
         label: 'PREÇO UNIT.', 
         align: 'left',
         render: (value) => (
            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </Typography>
         )
      },
      { 
         id: 'duracao', 
         label: 'DURAÇÃO', 
         align: 'left',
         render: (value) => (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
               {value} min
            </Typography>
         )
      },
      {
         id: 'status_fake',
         label: 'STATUS',
         align: 'center',
         render: () => (
            <Chip 
               label="Ativo" 
               size="small"
               sx={{ 
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.15), 
                  color: 'success.main', 
                  fontWeight: 700, 
                  fontSize: '0.7rem',
                  borderRadius: '6px',
                  height: '24px'
               }} 
            />
         )
      }
   ],
   fields: [
      { id: 'nome_servico', label: 'Nome do Serviço', type: 'text', placeholder: 'Ex: Corte Americano', halfWidth: false },
      { id: 'preco', label: 'Preço (R$)', type: 'number', placeholder: '0.00', halfWidth: true },
      { id: 'duracao', label: 'Duração (Minutos)', type: 'number', placeholder: 'Ex: 30', halfWidth: true }
   ]
};

export default serviceConfig;