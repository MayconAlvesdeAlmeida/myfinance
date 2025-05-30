import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6 || password.length > 10) {
      newErrors.password = 'Password must be between 6 and 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: '400px',
        mt: 2,
      }}
    >
      {error && (
        <Alert severity="error\" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        disabled={isLoading}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        sx={{
          mt: 2,
          height: 48,
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Button
          color="primary"
          onClick={() => navigate('/signup')}
          sx={{ p: 0, textTransform: 'none', fontWeight: 'bold' }}
        >
          Sign up
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;