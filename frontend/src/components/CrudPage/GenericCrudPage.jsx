import React, { useState } from 'react';
import { Box, Typography, Stack, TextField, InputAdornment, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import GenericQuickExitModal from './GenericQuickExitModal';

const GenericPageCrud = ({
  title,
  subtitle,
  buttonLabel,
  searchPlaceholder,
  columns,
  data,
  formFields,
  onSave,
  onDelete,
  onUpdate,
  onQuickExit,
  showQuickExit = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickExitItem, setQuickExitItem] = useState(null);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => { setSelectedItem(null); setIsModalOpen(true); };
  const handleEdit = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setSelectedItem(null); };

  const handleOpenQuickExit = (item) => setQuickExitItem(item);
  const handleCloseQuickExit = () => setQuickExitItem(null);
  const handleConfirmQuickExit = (id, quantity) => {
    if (onQuickExit) onQuickExit(quickExitItem, quantity);
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Page header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', sm: '2.125rem' } }}>
              {title}
            </Typography>
            <Chip
              label={filteredData.length}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'action.selected', color: 'primary.main' }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
          {buttonLabel}
        </Button>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />

      <GenericTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={onDelete}
        onQuickExit={showQuickExit ? handleOpenQuickExit : undefined}
        showQuickExit={showQuickExit}
      />

      <GenericModal
        key={selectedItem ? (selectedItem.id || selectedItem._id) : 'new-item'}
        open={isModalOpen}
        handleClose={handleClose}
        title={title}
        fields={formFields}
        initialData={selectedItem}
        onSave={onSave}
        onUpdate={onUpdate}
      />

      {showQuickExit && (
        <GenericQuickExitModal
          open={Boolean(quickExitItem)}
          handleClose={handleCloseQuickExit}
          item={quickExitItem}
          onConfirm={handleConfirmQuickExit}
          itemLabel="nome"
          quantityLabel="quantidade"
        />
      )}
    </Box>
  );
};

export default GenericPageCrud;