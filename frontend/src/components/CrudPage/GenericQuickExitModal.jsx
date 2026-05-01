import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Stack, alpha, IconButton
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const WARNING_GRADIENT = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

const GenericQuickExitModal = ({
  open,
  handleClose,
  item,
  onConfirm,
  itemLabel = 'nome',
  quantityLabel = 'quantidade',
  icon: Icon = RemoveCircleOutlineIcon,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) setQuantity(1);
  }, [open]);

  const currentQty = item?.[quantityLabel] || 0;
  const newQty = Math.max(0, currentQty - quantity);

  const handleConfirm = () => {
    onConfirm(item?.id || item?._id, quantity);
    handleClose();
  };

  const increment = () => setQuantity(q => Math.min(q + 1, currentQty));
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 3, pb: 2.5,
        background: alpha('#f59e0b', 0.06),
        borderBottom: '1px solid', borderColor: alpha('#f59e0b', 0.15),
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: WARNING_GRADIENT }} />
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: WARNING_GRADIENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245,158,11,0.4)', flexShrink: 0,
          }}>
            <Icon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Saída Rápida
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Registrar baixa de estoque
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Product name */}
        <Box sx={{
          p: 1.5, mb: 2.5, borderRadius: 2,
          bgcolor: 'background.default',
          border: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>
            Produto
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {item?.[itemLabel] || '—'}
          </Typography>
        </Box>

        {/* Stock preview */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
          <Box sx={{
            flex: 1, p: 2, borderRadius: 2, textAlign: 'center',
            bgcolor: alpha('#3b82f6', 0.06),
            border: '1px solid', borderColor: alpha('#3b82f6', 0.15),
          }}>
            <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600, display: 'block', mb: 0.25 }}>
              ESTOQUE ATUAL
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              {currentQty}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '1.25rem' }}>
            →
          </Box>

          <Box sx={{
            flex: 1, p: 2, borderRadius: 2, textAlign: 'center',
            bgcolor: alpha(newQty === 0 ? '#ef4444' : '#10b981', 0.06),
            border: '1px solid', borderColor: alpha(newQty === 0 ? '#ef4444' : '#10b981', 0.15),
          }}>
            <Typography variant="caption" sx={{ color: newQty === 0 ? '#ef4444' : '#10b981', fontWeight: 600, display: 'block', mb: 0.25 }}>
              APÓS SAÍDA
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: newQty === 0 ? '#ef4444' : '#10b981' }}>
              {newQty}
            </Typography>
          </Box>
        </Stack>

        {/* Quantity selector */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            Quantidade para dar baixa
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={decrement}
              disabled={quantity <= 1}
              sx={{
                border: '1px solid', borderColor: 'divider',
                borderRadius: 2, width: 40, height: 40,
                '&:hover': { borderColor: 'warning.main', color: 'warning.main' },
                transition: 'all 0.2s',
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <TextField
              value={quantity}
              onChange={(e) => setQuantity(Math.min(currentQty, Math.max(1, parseInt(e.target.value) || 1)))}
              type="number"
              size="small"
              sx={{
                flex: 1,
                '& input': { textAlign: 'center', fontWeight: 800, fontSize: '1.25rem' },
              }}
              inputProps={{ min: 1, max: currentQty }}
            />

            <IconButton
              onClick={increment}
              disabled={quantity >= currentQty}
              sx={{
                border: '1px solid', borderColor: 'divider',
                borderRadius: 2, width: 40, height: 40,
                '&:hover': { borderColor: 'warning.main', color: 'warning.main' },
                transition: 'all 0.2s',
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ flex: 1 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            flex: 2,
            background: WARNING_GRADIENT,
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
            '&:hover': {
              background: WARNING_GRADIENT,
              boxShadow: '0 6px 20px rgba(245,158,11,0.45)',
            },
          }}
        >
          Confirmar Saída
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericQuickExitModal;
