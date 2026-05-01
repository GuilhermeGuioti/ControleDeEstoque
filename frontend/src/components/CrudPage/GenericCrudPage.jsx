import React, { useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Stack, TextField, InputAdornment, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GenericTable from "./GenericTable";
import GenericModal from "./GenericModal";

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
  showQuickExit = false
}) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   const filteredData = data.filter((item) => {
      return Object.values(item).some((value) =>
         String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
   });

   const handleAdd = () => {
      setSelectedItem(null);
      setIsModalOpen(true);
   };

   const handleEdit = (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
   };

   const handleClose = () => {
      setIsModalOpen(false);
      setSelectedItem(null);
   };

   const handleSaveInternal = (formData) => {
      onSave(formData, selectedItem);
      handleClose();
   };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ borderRadius: 2 }}>
            {buttonLabel}
          </Button>
        </Stack>

        <TextField
          fullWidth
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <GenericTable 
        columns={columns} 
        data={filteredData}
        onEdit={handleEdit}
        onDelete={onDelete}
        onQuickExit={onQuickExit}
        showQuickExit={showQuickExit}
      />

      <GenericModal 
         key={selectedItem ? (selectedItem.id || selectedItem._id) : 'new-item'}
         open={isModalOpen}
         handleClose={handleClose}
         title={title}
         fields={formFields}
         initialData={selectedItem}
         onSave={handleSaveInternal}
         onUpdate={onUpdate}
      />
    </Container>
  );
};

export default GenericPageCrud;