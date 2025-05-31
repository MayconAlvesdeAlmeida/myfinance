import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BarChart4, CreditCard, PieChart, Wallet } from 'lucide-react';

const Landing: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Track Expenses',
      description: 'Keep track of all your expenses in one place.',
      icon: <CreditCard size={36} />,
    },
    {
      title: 'Monitor Income',
      description: 'Track all sources of income easily.',
      icon: <Wallet size={36} />,
    },
    {
      title: 'Visual Reports',
      description: 'Get visual reports of your financial activities.',
      icon: <PieChart size={36} />,
    },
    {
      title: 'Financial Analysis',
      description: 'Analyze your spending habits over time.',
      icon: <BarChart4 size={36} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            FinanceTracker
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link component={RouterLink} to="#who-we-are" color="inherit" underline="none" sx={{ mx: 1 }}>
              Who We Are
            </Link>
            <Link component={RouterLink} to="#services" color="inherit" underline="none" sx={{ mx: 1 }}>
              Services
            </Link>
            {!isMobile && (
              <>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="outlined"
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  Sign Up
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 12 },
          backgroundImage: 'linear-gradient(to right, #1A237E, #00796B)',
          color: 'white',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Manage Your Finances with Ease
              </Typography>
              <Typography variant="h5" paragraph>
                Take control of your personal finances with our simple yet powerful tracking tools.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    '&:hover': { backgroundColor: '#FFC400' },
                    px: 4,
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/7821814/pexels-photo-7821814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Finance Management"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} id="services">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
          Everything you need to manage your personal finances in one place.
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Us Section */}
      <Box sx={{ backgroundColor: 'grey.100', py: 8 }} id="who-we-are">
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Who We Are
              </Typography>
              <Typography variant="body1" paragraph>
                We're a team of finance and technology enthusiasts dedicated to helping individuals manage their personal finances effectively.
              </Typography>
              <Typography variant="body1" paragraph>
                Our mission is to provide simple yet powerful tools that make financial management accessible to everyone, regardless of their financial background or expertise.
              </Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/8867426/pexels-photo-8867426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Our Team"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Take Control of Your Finances?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Join thousands of users who have transformed their financial habits.
          </Typography>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#FFD700',
              color: '#000',
              '&:hover': { backgroundColor: '#FFC400' },
              px: 4,
            }}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'grey.900', color: 'grey.500', py: 4, mt: 'auto' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="white" gutterBottom>
                FinanceTracker
              </Typography>
              <Typography variant="body2">
                Making personal finance management simple and effective.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Quick Links
              </Typography>
              <Link component={RouterLink} to="#who-we-are" color="inherit" display="block" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link component={RouterLink} to="#services" color="inherit" display="block" sx={{ mb: 1 }}>
                Services
              </Link>
              <Link component={RouterLink} to="/login" color="inherit" display="block" sx={{ mb: 1 }}>
                Login
              </Link>
              <Link component={RouterLink} to="/signup" color="inherit" display="block" sx={{ mb: 1 }}>
                Sign Up
              </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                Email: support@financetracker.com
              </Typography>
              <Typography variant="body2">
                Phone: +1 (555) 123-4567
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © {new Date().getFullYear()} FinanceTracker. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;