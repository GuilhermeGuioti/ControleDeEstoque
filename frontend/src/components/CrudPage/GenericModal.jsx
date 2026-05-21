import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Stack, MenuItem, alpha, useTheme
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { BRAND_GRADIENT } from '../../style/theme';
import {
  applyMask,
  unmask,
  parseCurrencyBRL,
  formatCurrencyBRLFromNumber,
} from '../../utils/masks';

const GenericModal = ({ open, handleClose, title, fields, initialData, onSave, onUpdate }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({});

  // Backend devolve valores crus (cpf "11111111111", data "2025-01-15T00:00:00").
  // Aqui re-aplica máscara e normaliza data para YYYY-MM-DD aceito por <input type="date">.
  const hydrateInitialData = (raw) => {
    if (!raw) return {};
    const data = { ...raw };
    fields.forEach((field) => {
      const value = data[field.id];
      if (value === undefined || value === null || value === '') return;
      if (field.mask && field.mask !== 'currency') {
        data[field.id] = applyMask(field.mask, String(value));
      } else if (field.type === 'date') {
        const s = String(value);
        if (s.includes('T')) data[field.id] = s.split('T')[0];
        else if (s.includes(' ')) data[field.id] = s.split(' ')[0];
      } else if (field.type === 'time') {
        // backend devolve "HH:MM:SS", input HTML quer "HH:MM"
        const s = String(value);
        const parts = s.split(':');
        if (parts.length >= 2) data[field.id] = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
    });
    return data;
  };

  useEffect(() => {
    if (open) setFormData(hydrateInitialData(initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const handleChange = (id, value, type) => {
    const finalValue = type === 'number' && value !== '' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleMaskedChange = (field, rawValue) => {
    if (field.mask === 'currency') {
      const masked = applyMask('currency', rawValue);
      const numeric = parseCurrencyBRL(masked);
      setFormData(prev => ({ ...prev, [field.id]: numeric }));
      return;
    }
    const masked = applyMask(field.mask, rawValue);
    setFormData(prev => ({ ...prev, [field.id]: masked }));
  };

  const getFieldDisplayValue = (field) => {
    const value = formData[field.id];
    if (field.mask === 'currency') {
      return formatCurrencyBRLFromNumber(value);
    }
    return value ?? '';
  };

  const isEditing = Boolean(initialData && (initialData.id || initialData._id));

  // Tira a formatação de campos mascarados (CPF, RG, CEP, telefone) antes de enviar.
  // Backend persiste somente dígitos e colunas têm limite (varchar(11), varchar(9) etc.).
  const buildPayload = () => {
    const payload = { ...formData };
    fields.forEach((field) => {
      if (!field.mask) return;
      if (field.mask === 'currency') return; // currency já está como número
      const raw = payload[field.id];
      if (raw === undefined || raw === null || raw === '') return;
      payload[field.id] = unmask(field.mask, raw);
    });
    // remove campos vazios ('' -> null) para não enviar strings vazias para o backend
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '') payload[key] = null;
    });
    return payload;
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    if (isEditing) {
      onUpdate(payload.id || payload._id, payload);
    } else {
      onSave(payload);
    }
    handleClose();
  };

  const headerColor = isEditing ? theme.palette.primary.main : '#10b981';
  const headerGradient = isEditing
    ? BRAND_GRADIENT
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }
        }
      }}
    >
      <Box sx={{
        p: 3, pb: 2.5,
        background: alpha(headerColor, 0.06),
        borderBottom: '1px solid',
        borderColor: alpha(headerColor, 0.15),
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: headerGradient,
        }} />

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: headerGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(headerColor, 0.4)}`,
            flexShrink: 0,
          }}>
            {isEditing
              ? <EditOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
              : <AddCircleOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
            }
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {isEditing ? `Editar ${title}` : `Novo ${title}`}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isEditing ? 'Atualize as informações do registro' : 'Preencha os dados para criar um novo registro'}
            </Typography>
          </Box>
          <Box sx={{
            px: 1.5, py: 0.5, borderRadius: 2,
            background: alpha(headerColor, 0.12),
            border: '1px solid', borderColor: alpha(headerColor, 0.2),
          }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: headerColor, fontSize: '0.68rem' }}>
              {isEditing ? 'EDIÇÃO' : 'NOVO'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Stack spacing={2.5}>
          {fields.map((field) => (
            <Box key={field.id}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.75, ml: 0.25 }}
              >
                {field.label}
              </Typography>
              <TextField
                fullWidth
                type={field.mask ? 'text' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'}
                select={field.type === 'select'}
                value={field.mask ? getFieldDisplayValue(field) : (formData[field.id] ?? '')}
                onChange={(e) => field.mask
                  ? handleMaskedChange(field, e.target.value)
                  : handleChange(field.id, e.target.value, field.type)}
                InputLabelProps={(field.type === 'date' || field.type === 'time') ? { shrink: true } : undefined}
                placeholder={field.placeholder}
                inputMode={field.mask === 'currency' || field.mask === 'cpf' || field.mask === 'cnpj' || field.mask === 'cep' || field.mask === 'phone' ? 'numeric' : undefined}
                size="medium"
                multiline={field.multiline || false}
                minRows={field.multiline ? 2 : undefined}
              >
                {field.type === 'select' && (field.options || []).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        p: 2.5, pt: 2,
        borderTop: '1px solid', borderColor: 'divider',
        gap: 1,
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ px: 3, flex: 1 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            px: 4, flex: 2,
            ...(isEditing ? {} : {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.45)',
              },
            }),
          }}
        >
          {isEditing ? 'Salvar Alterações' : `Cadastrar ${title}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal;
