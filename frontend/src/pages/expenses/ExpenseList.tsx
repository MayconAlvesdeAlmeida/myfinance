import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { expensesAPI } from '../../services/api';
import { DateRangeFilter as DateRangeFilterType, Transaction } from '../../types';
import TransactionList from '../../components/transactions/TransactionList';
import DateRangeFilter from '../../components/transactions/DateRangeFilter';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateFilter, setDateFilter] = useState<DateRangeFilterType>({});
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expensesAPI.getAll(
        page,
        pageSize,
        dateFilter.start_date,
        dateFilter.end_date
      );
      setExpenses(response.items);
      setTotalItems(response.pagination.total_items);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, pageSize, dateFilter]);

  const handleDeleteExpense = async (id: number) => {
    try {
      await expensesAPI.delete(id);
      // Refresh the list
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleResetFilter = () => {
    setDateFilter({});
    setPage(1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expenses
        </Typography>
        <Button
          component={Link}
          to="/expenses/new"
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
        >
          Add Expense
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <DateRangeFilter
        filter={dateFilter}
        onFilterChange={setDateFilter}
        onResetFilter={handleResetFilter}
      />

      <TransactionList
        transactions={expenses}
        onDelete={handleDeleteExpense}
        isLoading={isLoading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        type="expense"
      />
    </Box>
  );
};

export default ExpenseList;