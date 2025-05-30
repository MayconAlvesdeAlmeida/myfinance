import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
            Create an Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Join us to manage your personal finances effectively
          </Typography>

          <SignupForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;