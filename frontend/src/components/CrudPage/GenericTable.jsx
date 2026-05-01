import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Stack, CircularProgress, Typography,
  TableSortLabel, Tooltip, Box, alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTheme } from '@mui/material/styles';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onQuickExit,
  showQuickExit = false,
  emptyMessage = 'Nenhum registro encontrado.',
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) return 0;
    const va = a[orderBy];
    const vb = b[orderBy];
    if (vb < va) return order === 'desc' ? -1 : 1;
    if (vb > va) return order === 'desc' ? 1 : -1;
    return 0;
  });

  const hasActions = onEdit || onDelete || (showQuickExit && onQuickExit);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        mt: 2,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sortDirection={orderBy === col.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => handleRequestSort(col.id)}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      color: `${theme.palette.primary.main} !important`,
                      opacity: orderBy === col.id ? 1 : 0.3,
                    },
                  }}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            {hasActions && (
              <TableCell align="center">Ações</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} sx={{ py: 10, textAlign: 'center', border: 'none' }}>
                <CircularProgress size={28} sx={{ color: 'primary.main' }} />
              </TableCell>
            </TableRow>
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} sx={{ py: 10, textAlign: 'center', border: 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => (
              <TableRow
                key={row.id || index}
                sx={{
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                  '&:last-child td': { border: 'none' },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align || 'left'} sx={{ color: 'text.primary' }}>
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      {showQuickExit && onQuickExit && (
                        <Tooltip title="Saída rápida" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => onQuickExit(row)}
                            sx={{
                              color: 'warning.main',
                              '&:hover': {
                                bgcolor: alpha('#f59e0b', 0.1),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Editar" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(row)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Excluir" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(row.id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: alpha('#ef4444', 0.1),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
