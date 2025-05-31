import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import { incomesAPI } from '../../services/api';
import { TransactionFormData } from '../../types';
import TransactionForm from '../../components/transactions/TransactionForm';

const IncomeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<Partial<TransactionFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    const fetchIncome = async () => {
      if (isEditing) {
        try {
          setIsLoadingData(true);
          const income = await incomesAPI.getById(parseInt(id));
          setInitialData({
            title: income.title,
            description: income.description,
            value: Number(income.value),
            transaction_date: new Date(income.transaction_date)
              .toISOString()
              .split('T')[0],
          });
        } catch (error) {
          console.error('Error fetching income:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    fetchIncome();
  }, [id, isEditing]);

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      setIsLoading(true);
      if (isEditing) {
        await incomesAPI.update(parseInt(id), data);
      } else {
        await incomesAPI.create(data);
      }
      navigate('/income');
    } catch (error) {
      console.error('Error saving income:', error);
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Income' : 'Add New Income'}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />

      {isLoadingData ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography>Loading income data...</Typography>
        </Box>
      ) : (
        <TransactionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          title={isEditing ? 'Edit Income Details' : 'Enter Income Details'}
          submitButtonText={isEditing ? 'Update Income' : 'Add Income'}
          isEditing={isEditing}
        />
      )}
    </Box>
  );
};

export default IncomeForm;