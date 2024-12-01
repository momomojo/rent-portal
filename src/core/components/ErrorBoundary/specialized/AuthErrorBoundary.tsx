import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorFallbackProps } from '../types';
import { useAuth } from '../../../hooks/useAuth';

const AuthErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <Typography variant="h6" color="error" gutterBottom>
        Authentication Error
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {error.message || 'There was a problem with authentication'}
      </Typography>
      <div className="flex space-x-3">
        <Button
          variant="contained"
          color="primary"
          onClick={resetError}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      name="auth"
      level="feature"
      fallback={AuthErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
};
