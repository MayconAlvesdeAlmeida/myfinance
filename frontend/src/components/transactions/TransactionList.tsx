import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Edit, Trash2, Info } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
  totalItems: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  type: 'expense' | 'income';
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  isLoading,
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  type,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewDetails = (id: number) => {
    navigate(`/${type === 'expense' ? 'expenses' : 'income'}/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/${type === 'expense' ? 'expenses' : 'income'}/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedTransactionId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransactionId !== null) {
      await onDelete(selectedTransactionId);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedTransactionId(null);
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // API pages are 1-indexed
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(1); // Reset to first page
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography>Loading transactions...</Typography>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {type === 'expense' ? 'expenses' : 'income'} found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/${type === 'expense' ? 'expenses' : 'income'}/new`)}
            sx={{ mt: 2 }}
          >
            Add {type === 'expense' ? 'an Expense' : 'Income'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              sx={{
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {transaction.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color={type === 'expense' ? 'error.main' : 'success.main'}
                    fontWeight="bold"
                  >
                    {type === 'expense' ? '-' : '+'}
                    {Number(transaction.value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </Typography>
                {transaction.description && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {transaction.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(transaction.id)}
                    color="info"
                  >
                    <Info size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(transaction.id)}
                    color="primary"
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(transaction.id)}
                    color="error"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1} // Convert 1-indexed to 0-indexed
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography fontWeight="medium">{transaction.title}</Typography>
                </TableCell>
                <TableCell>
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {transaction.description && (
                    <Typography
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px',
                      }}
                    >
                      {transaction.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    fontWeight="bold"
                    color={type === 'expense' ? 'error.main' : 'success.main'}
                  >
                    {type === 'expense' ? '-' : '+'}
                    {Number(transaction.value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(transaction.id)}
                      color="info"
                    >
                      <Info size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(transaction.id)}
                      color="primary"
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(transaction.id)}
                      color="error"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalItems}
        page={page - 1} // Convert 1-indexed to 0-indexed
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionList;