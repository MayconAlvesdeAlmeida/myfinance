import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import { expensesAPI } from '../../services/api';
import { TransactionFormData } from '../../types';
import TransactionForm from '../../components/transactions/TransactionForm';

const ExpenseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<Partial<TransactionFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    const fetchExpense = async () => {
      if (isEditing) {
        try {
          setIsLoadingData(true);
          const expense = await expensesAPI.getById(parseInt(id));
          setInitialData({
            title: expense.title,
            description: expense.description,
            value: Number(expense.value),
            transaction_date: new Date(expense.transaction_date)
              .toISOString()
              .split('T')[0],
          });
        } catch (error) {
          console.error('Error fetching expense:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    fetchExpense();
  }, [id, isEditing]);

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      setIsLoading(true);
      if (isEditing) {
        await expensesAPI.update(parseInt(id), data);
      } else {
        await expensesAPI.create(data);
      }
      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />

      {isLoadingData ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography>Loading expense data...</Typography>
        </Box>
      ) : (
        <TransactionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          title={isEditing ? 'Edit Expense Details' : 'Enter Expense Details'}
          submitButtonText={isEditing ? 'Update Expense' : 'Add Expense'}
          isEditing={isEditing}
        />
      )}
    </Box>
  );
};

export default ExpenseForm;