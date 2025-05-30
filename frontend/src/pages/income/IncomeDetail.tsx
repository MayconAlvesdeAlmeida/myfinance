import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { ArrowUpCircle, Calendar, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { incomesAPI } from '../../services/api';
import { Transaction } from '../../types';

const IncomeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [income, setIncome] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncome = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await incomesAPI.getById(parseInt(id));
        setIncome(data);
      } catch (error) {
        console.error('Error fetching income:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncome();
  }, [id]);

  const handleEdit = () => {
    navigate(`/income/edit/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    try {
      await incomesAPI.delete(parseInt(id));
      navigate('/income');
    } catch (error) {
      console.error('Error deleting income:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography>Loading income details...</Typography>
      </Box>
    );
  }

  if (!income) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography>Income not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/income')}
          sx={{ mt: 2 }}
        >
          Back to Income
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ChevronLeft />}
          onClick={() => navigate('/income')}
          sx={{ ml: -1 }}
        >
          Back to Income
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Income Details
      </Typography>
      
      <Divider sx={{ mb: 4 }} />
      
      <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 3,
            backgroundColor: 'success.main',
            color: 'success.contrastText',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ArrowUpCircle size={24} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" component="h2">
                {income.title}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={new Date(income.transaction_date).toLocaleDateString()}
                icon={<Calendar size={16} />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Grid>
          </Grid>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ minHeight: '100px' }}>
                {income.description || 'No description provided.'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'success.light',
                  color: 'success.dark',
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
                  Income Amount
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {Number(income.value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the income "{income.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomeDetail;