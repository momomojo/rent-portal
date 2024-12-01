import { createTheme, ThemeOptions } from '@mui/material/styles';

// Only import the components we actually use
import type {} from '@mui/material/Button';
import type {} from '@mui/material/Dialog';
import type {} from '@mui/material/TextField';

export const materialThemeOptions: ThemeOptions = {
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Disable ripple for better performance
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        disablePortal: true, // Better performance for dialogs
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
  // Disable unnecessary features
  typography: {
    fontFamily: 'inherit', // Use Tailwind's font
  },
  palette: {
    // Minimal palette to reduce bundle size
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#6b7280',
    },
  },
};

export const materialTheme = createTheme(materialThemeOptions);

// Preload critical Material-UI components
export const preloadMaterialComponents = () => {
  if (typeof window !== 'undefined') {
    const componentsToPreload = [
      () => import('@mui/material/Button'),
      () => import('@mui/material/Dialog'),
      () => import('@mui/material/TextField'),
    ];

    // Preload after initial render
    requestIdleCallback(() => {
      componentsToPreload.forEach(importFn => {
        importFn().catch(() => {
          // Silently fail preloading
        });
      });
    });
  }
};
