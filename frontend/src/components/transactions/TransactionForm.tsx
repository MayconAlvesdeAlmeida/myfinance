import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TransactionFormData } from '../../types';

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
  submitButtonText: string;
  isEditing?: boolean;
}

const defaultFormData: TransactionFormData = {
  title: '',
  description: '',
  value: 0,
  transaction_date: new Date().toISOString().split('T')[0],
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  title,
  submitButtonText,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    
    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Redirect back will be handled by the parent component
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isLoading}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Value"
              name="value"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={formData.value}
              onChange={handleInputChange}
              error={!!errors.value}
              helperText={errors.value}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Date"
              name="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={handleInputChange}
              error={!!errors.transaction_date}
              helperText={errors.transaction_date}
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Saving...' : submitButtonText}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TransactionForm;