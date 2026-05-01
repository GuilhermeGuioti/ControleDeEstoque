import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Stack, Chip, MenuItem
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const GenericModal = ({ open, handleClose, title, fields, initialData, onSave, onUpdate, entityIcon: Icon }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
    }
  }, [open, initialData]);

  const handleChange = (id, value, type) => {
    const finalValue = type === 'number' && value !== '' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [id]: finalValue }));
  };
  
  const isEditing = Boolean(initialData && (initialData.id || initialData._id));

  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(formData.id || formData._id, formData);
    } else {
      onSave(formData);
    }
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ 
        sx: { borderRadius: 3, overflow: 'hidden', mx: 2 } 
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha('#000', 0.5),
            backdropFilter: 'blur(4px)'
          }
        }
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          pb: 2, 
          background: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ p: 1.5, borderRadius: 2, background: 'primary.main', opacity: 0.12 }}>
            {Icon ? <Icon sx={{ color: 'primary.main', fontSize: 24 }} /> : <AddCircleIcon sx={{ color: 'primary.main', fontSize: 24 }} />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {isEditing ? `Editar ${title}` : `Novo ${title}`}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isEditing ? 'Atualize os dados informados' : 'Preencha os dados do novo registro'}
            </Typography>
          </Box>
          <Chip 
            label={isEditing ? 'Editando' : 'Criando'} 
            size="small" 
            sx={{ 
              fontWeight: 600,
              fontSize: '0.7rem',
              background: isEditing ? 'primary.main' : 'success.main',
              color: '#fff',
            }} 
          />
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Stack spacing={2.5}>
          {fields.map((field) => (
            <Box key={field.id}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  mb: 1,
                  ml: 0.5
                }}
              >
                {field.label}
              </Typography>
              <TextField
                fullWidth
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                select={field.type === 'select'}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value, field.type)}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                placeholder={field.placeholder}
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                {field.type === 'select' && field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            borderColor: 'divider',
            color: 'text.secondary'
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            background: isEditing ? 'primary.main' : 'success.main',
            boxShadow: 'none'
          }}
        >
          {isEditing ? 'Salvar Alterações' : `Cadastrar ${title}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal;