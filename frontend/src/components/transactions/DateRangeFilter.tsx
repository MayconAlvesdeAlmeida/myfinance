import React from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { DateRangeFilter as DateRangeFilterType } from '../../types';

interface DateRangeFilterProps {
  filter: DateRangeFilterType;
  onFilterChange: (filter: DateRangeFilterType) => void;
  onResetFilter: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      start_date: e.target.value || undefined,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      end_date: e.target.value || undefined,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter by Date
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            label="Start Date"
            type="date"
            value={filter.start_date || ''}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label="End Date"
            type="date"
            value={filter.end_date || ''}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Button
              variant="outlined"
              onClick={onResetFilter}
              sx={{ minWidth: '100px' }}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DateRangeFilter;