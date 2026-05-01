import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Button, Stack, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const GenericQuickExitModal = ({ 
  open, 
  handleClose, 
  item, 
  onConfirm, 
  itemLabel = 'nome',
  quantityLabel = 'quantidade',
  icon: Icon = RemoveCircleOutlineIcon,
  iconColor = 'warning.main'
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  const currentQty = item?.[quantityLabel] || 0;
  const newQty = Math.max(0, currentQty - quantity);

  const handleConfirm = () => {
    onConfirm(item?.id || item?._id, quantity);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: iconColor, opacity: 0.12, width: 40, height: 40 }}>
          <Icon sx={{ color: iconColor }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Saída Rápida
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {item?.[itemLabel]}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Estoque atual
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {currentQty}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Após saída
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {newQty}
            </Typography>
          </Box>
        </Stack>
        <TextField
          fullWidth
          label="Quantidade para dar baixa"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          size="large"
          inputProps={{
            style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="warning" sx={{ borderRadius: 2, px: 4 }}>
          Confirmar Saída
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericQuickExitModal;