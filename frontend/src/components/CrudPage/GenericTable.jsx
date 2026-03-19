import React, { useState } from 'react'; // Importar useState
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Stack, CircularProgress, Typography,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

const DataTable = ({ 
  columns = [], 
  data = [], 
  loading = false,
  onEdit, 
  onDelete,
  emptyMessage = "Nenhum registro encontrado."
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Ordena os dados antes de renderizar
  const sortedData = [...data].sort(getComparator(order, orderBy));

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mt: 3, position: 'relative' }}>
      <Table>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell 
                key={col.id} 
                align={col.align || 'left'}
                sortDirection={orderBy === col.id ? order : false}
                sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase' }}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => handleRequestSort(col.id)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textAlign: 'center' }}>AÇÕES</TableCell>
            )}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} sx={{ py: 10, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ color: 'primary.main' }} />
              </TableCell>
            </TableRow>
          ) : sortedData.length === 0 ? ( 
            <TableRow>
              <TableCell colSpan={columns.length + 1} sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => ( 
              <TableRow key={row.id || index} sx={{ '&:hover': { bgcolor: 'background.default' }, transition: '0.2s' }}>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align || 'left'} sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </TableCell>
                ))}
                
                {(onEdit || onDelete) && (
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {onEdit && (
                        <IconButton size="small" sx={{ color: 'primary.main', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => onEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton size="small" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => onDelete(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;