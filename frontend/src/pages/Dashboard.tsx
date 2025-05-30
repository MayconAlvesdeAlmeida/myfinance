import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { expensesAPI, incomesAPI } from '../services/api';
import { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [expensesData, incomesData] = await Promise.all([
          expensesAPI.getAll(1, 5),
          incomesAPI.getAll(1, 5),
        ]);
        
        setExpenses(expensesData.items);
        setIncomes(incomesData.items);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.value), 0);
  const totalIncomes = incomes.reduce((acc, income) => acc + Number(income.value), 0);
  const balance = totalIncomes - totalExpenses;

  const summaryCards = [
    {
      title: 'Total Income',
      value: totalIncomes.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: <ArrowUpCircle size={24} />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
    },
    {
      title: 'Total Expenses',
      value: totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: <ArrowDownCircle size={24} />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
    },
    {
      title: 'Balance',
      value: balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: <Wallet size={24} />,
      color: balance >= 0 ? theme.palette.info.main : theme.palette.error.main,
      bgColor: balance >= 0 ? theme.palette.info.light : theme.palette.error.light,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Financial Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={1}
              sx={{
                height: '100%',
                borderLeft: '4px solid',
                borderColor: card.color,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: card.bgColor,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArrowDownCircle size={20} color={theme.palette.error.main} />
              Recent Expenses
            </Typography>
            {isLoading ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>Loading...</Box>
            ) : expenses.length > 0 ? (
              expenses.map((expense) => (
                <Box
                  key={expense.id}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {expense.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(expense.transaction_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold" color="error.main">
                    -
                    {Number(expense.value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>No recent expenses</Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArrowUpCircle size={20} color={theme.palette.success.main} />
              Recent Income
            </Typography>
            {isLoading ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>Loading...</Box>
            ) : incomes.length > 0 ? (
              incomes.map((income) => (
                <Box
                  key={income.id}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {income.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(income.transaction_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    +
                    {Number(income.value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>No recent income</Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;