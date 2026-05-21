import { Typography, Box, Stack, Avatar, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonTwoTone';
import { alpha } from '@mui/material/styles';
import { applyMask } from '../utils/masks';

const SEXO_LABELS = { M: 'Masculino', F: 'Feminino', O: 'Outro' };

const clientConfig = {
   columns: [
      {
         id: 'nome',
         label: 'CLIENTE',
         render: (value, row) => (
            <Stack direction="row" spacing={2} alignItems="center">
               <Avatar
                  variant="rounded"
                  sx={{
                     width: 40, height: 40,
                     bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                     color: 'info.main',
                     borderRadius: '8px',
                     border: '1px solid',
                     borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
                  }}
               >
                  <PersonIcon sx={{ fontSize: '1.3rem' }} />
               </Avatar>
               <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.2 }}>
                     {value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
                     CPF: {row.cpf ? applyMask('cpf', row.cpf) : 'Não informado'}
                  </Typography>
               </Box>
            </Stack>
         )
      },
      {
         id: 'data_nascimento',
         label: 'NASCIMENTO',
         align: 'left',
         render: (value) => (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
               {value ? new Date(value).toLocaleDateString('pt-BR') : '—'}
            </Typography>
         )
      },
      {
         id: 'sexo',
         label: 'SEXO',
         align: 'center',
         render: (value) => (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center' }}>
               {SEXO_LABELS[value] || value || '—'}
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
                  fontWeight: 700, fontSize: '0.7rem',
                  borderRadius: '6px', height: '24px',
               }}
            />
         )
      },
   ],
   // Cliente no backend: nome*, cpf?, rg?, data_nascimento?, sexo? (varchar(1)).
   // enderecos[] e telefones[] também são suportados mas tratados em telas separadas.
   fields: [
      { id: 'nome', label: 'Nome Completo', type: 'text', placeholder: 'Ex: João Silva' },
      { id: 'cpf', label: 'CPF', type: 'text', mask: 'cpf', placeholder: '000.000.000-00' },
      { id: 'rg', label: 'RG', type: 'text', mask: 'rg', placeholder: '00.000.000-0' },
      { id: 'data_nascimento', label: 'Data de Nascimento', type: 'date' },
      {
         id: 'sexo', label: 'Sexo', type: 'select',
         options: [
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Feminino' },
            { value: 'O', label: 'Outro' },
         ],
      },
   ],
};

export default clientConfig;
