import { Typography, Box, Stack, Avatar } from '@mui/material';
import LabelIcon from '@mui/icons-material/LabelTwoTone';
import { alpha } from '@mui/material/styles';

// Config genérica para tabelas-pivô com schema { id, nome }:
// /categorias/, /fabricantes/, /fornecedores/
const buildLookupConfig = ({ entityLabel = 'Item', placeholder = 'Ex: Nome' } = {}) => ({
   columns: [
      {
         id: 'nome',
         label: entityLabel.toUpperCase(),
         render: (value, row) => (
            <Stack direction="row" spacing={2} alignItems="center">
               <Avatar
                  variant="rounded"
                  sx={{
                     width: 36, height: 36,
                     bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                     color: 'primary.main',
                     borderRadius: '8px',
                     border: '1px solid',
                     borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  }}
               >
                  <LabelIcon sx={{ fontSize: '1.2rem' }} />
               </Avatar>
               <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.2 }}>
                     {value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
                     ID: {String(row.id || '').slice(0, 8)}
                  </Typography>
               </Box>
            </Stack>
         ),
      },
   ],
   fields: [
      { id: 'nome', label: 'Nome', type: 'text', placeholder },
   ],
});

export default buildLookupConfig;
