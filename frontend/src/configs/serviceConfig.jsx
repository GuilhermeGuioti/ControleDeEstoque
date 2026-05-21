import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCutTwoTone';
import { alpha } from '@mui/material/styles';

const serviceConfig = {
   columns: [
      {
         id: 'nome',
         label: 'SERVIÇO',
         render: (value, row) => (
            <Stack direction="row" spacing={2} alignItems="center">
               <Avatar
                  variant="rounded"
                  sx={{
                     width: 40, height: 40,
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
                  {row.descricao && (
                     <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
                        {row.descricao}
                     </Typography>
                  )}
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
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)}
            </Typography>
         )
      },
      {
         id: 'duracao',
         label: 'DURAÇÃO',
         align: 'left',
         render: (value) => {
            // Backend agora retorna `duracao` como `HH:MM:SS` (Python time).
            if (!value) {
               return (
                  <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', fontWeight: 500 }}>
                     —
                  </Typography>
               );
            }
            const parts = String(value).split(':');
            let label = String(value);
            if (parts.length >= 2) {
               const h = parseInt(parts[0], 10) || 0;
               const m = parseInt(parts[1], 10) || 0;
               if (h && m) label = `${h}h ${String(m).padStart(2, '0')}min`;
               else if (h) label = `${h}h`;
               else label = `${m}min`;
            }
            return (
               <Chip
                  label={label}
                  size="small"
                  sx={{
                     bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                     color: 'info.main',
                     fontWeight: 600, fontSize: '0.7rem',
                     borderRadius: '6px', height: '24px',
                  }}
               />
            );
         }
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
                  fontWeight: 700, fontSize: '0.7rem',
                  borderRadius: '6px', height: '24px',
               }}
            />
         )
      },
   ],
   fields: [
      { id: 'nome', label: 'Nome do Serviço', type: 'text', placeholder: 'Ex: Corte Americano' },
      { id: 'descricao', label: 'Descrição', type: 'text', placeholder: 'Breve descrição do serviço' },
      { id: 'preco', label: 'Preço', type: 'text', mask: 'currency', placeholder: 'R$ 0,00' },
      { id: 'duracao', label: 'Duração', type: 'time', placeholder: 'HH:MM' },
   ],
};

export default serviceConfig;
