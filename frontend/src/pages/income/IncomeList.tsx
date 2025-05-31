import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { incomesAPI } from '../../services/api';
import { DateRangeFilter as DateRangeFilterType, Transaction } from '../../types';
import TransactionList from '../../components/transactions/TransactionList';
import DateRangeFilter from '../../components/transactions/DateRangeFilter';

const IncomeList: React.FC = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateFilter, setDateFilter] = useState<DateRangeFilterType>({});
  const navigate = useNavigate();

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await incomesAPI.getAll(
        page,
        pageSize,
        dateFilter.start_date,
        dateFilter.end_date
      );
      setIncomes(response.items);
      setTotalItems(response.pagination.total_items);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [page, pageSize, dateFilter]);

  const handleDeleteIncome = async (id: number) => {
    try {
      await incomesAPI.delete(id);
      // Refresh the list
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
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
          Income
        </Typography>
        <Button
          component={Link}
          to="/income/new"
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
        >
          Add Income
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <DateRangeFilter
        filter={dateFilter}
        onFilterChange={setDateFilter}
        onResetFilter={handleResetFilter}
      />

      <TransactionList
        transactions={incomes}
        onDelete={handleDeleteIncome}
        isLoading={isLoading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        type="income"
      />
    </Box>
  );
};

export default IncomeList;