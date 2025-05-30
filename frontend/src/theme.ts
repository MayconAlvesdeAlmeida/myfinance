import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      light: '#4D5AB9',
      main: '#1A237E', // Deep blue
      dark: '#000051',
      contrastText: '#fff',
    },
    secondary: {
      light: '#4DB6AC',
      main: '#00796B', // Teal
      dark: '#004D40',
      contrastText: '#fff',
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#B71C1C',
      contrastText: '#fff',
    },
    warning: {
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#4FC3F7',
      main: '#29B6F6',
      dark: '#0288D1',
      contrastText: '#fff',
    },
    success: {
      light: '#81C784',
      main: '#4CAF50',
      dark: '#2E7D32',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;