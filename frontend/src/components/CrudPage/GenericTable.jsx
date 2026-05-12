import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Stack, CircularProgress, Typography,
  TableSortLabel, Tooltip, Box, alpha, Card, CardContent, useMediaQuery,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={28} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (sortedData.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{emptyMessage}</Typography>
      </Box>
    );
  }

  // Mobile: card list
  if (isMobile) {
    // Identify the "main" column (first one) and show top 2 columns on card header
    const primaryCol = columns[0];
    const secondaryCol = columns[1];

    return (
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {sortedData.map((row, index) => (
          <Card
            key={row.id || index}
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Primary and secondary info */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    {primaryCol?.render ? primaryCol.render(row[primaryCol.id], row) : row[primaryCol?.id]}
                  </Typography>
                  {secondaryCol && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {secondaryCol.label}: {secondaryCol?.render ? secondaryCol.render(row[secondaryCol.id], row) : row[secondaryCol?.id]}
                    </Typography>
                  )}
                </Box>
                {/* Actions */}
                {hasActions && (
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
                    {showQuickExit && onQuickExit && (
                      <IconButton
                        size="small"
                        onClick={() => onQuickExit(row)}
                        sx={{ color: 'warning.main', '&:hover': { bgcolor: alpha('#f59e0b', 0.1) } }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        sx={{ color: 'primary.main', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => onDelete(row.id)}
                        sx={{ color: 'error.main', '&:hover': { bgcolor: alpha('#ef4444', 0.1) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Stack>

              {/* Remaining columns as key-value pairs */}
              {columns.slice(2).length > 0 && (
                <Stack spacing={0.5} sx={{
                  pt: 1, borderTop: '1px solid', borderColor: 'divider',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '4px 12px',
                }}>
                  {columns.slice(2).map((col) => (
                    <Box key={col.id}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {col.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {col.render ? col.render(row[col.id], row) : (row[col.id] ?? '—')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Desktop: table
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid', borderColor: 'divider',
        borderRadius: 3, mt: 2, overflow: 'hidden',
      }}
    >
      <Box sx={{ overflowX: 'auto' }}>
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
              {hasActions && <TableCell align="center">Ações</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.map((row, index) => (
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
                            sx={{ color: 'warning.main', '&:hover': { bgcolor: alpha('#f59e0b', 0.1), transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
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
                            sx={{ color: 'primary.main', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
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
                            sx={{ color: 'error.main', '&:hover': { bgcolor: alpha('#ef4444', 0.1), transform: 'scale(1.1)' }, transition: 'all 0.2s' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default DataTable;