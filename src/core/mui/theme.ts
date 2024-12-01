import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    // Optimize Button rendering
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Reduces JS overhead
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents unnecessary text transformation
        },
      },
    },
    // Optimize Typography rendering
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'h6',
          subtitle2: 'h6',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    // Optimize Dialog performance
    MuiDialog: {
      defaultProps: {
        disablePortal: true, // Reduces DOM operations
        keepMounted: false, // Unmount when closed
      },
    },
    // Optimize TextField rendering
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Use outlined by default for better performance
      },
    },
  },
  // Optimize palette to reduce CSS variables
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
  },
  // Optimize typography to reduce CSS output
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  // Optimize shape values
  shape: {
    borderRadius: 8,
  },
});