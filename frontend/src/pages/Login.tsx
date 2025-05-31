import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Alert, Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: string; message?: string } | null;

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 5,
        backgroundImage: 'linear-gradient(to right bottom, #1A237E, #00796B)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Welcome Back
          </Typography>
          
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Login to access your finance dashboard
          </Typography>

          {state?.message && (
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              {state.message}
            </Alert>
          )}

          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;