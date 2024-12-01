import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorFallbackProps } from '../types';
import { Home, RefreshCw } from 'lucide-react';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

const RouteErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <Typography variant="h4" color="error" gutterBottom>
        Page Load Error
      </Typography>
      <Typography variant="body1" color="muted" align="center" className="mb-1">
        Failed to load: {location.pathname}
      </Typography>
      <Typography variant="caption" color="muted" align="center" className="mb-6">
        {error.message}
      </Typography>
      <div className="flex space-x-3">
        <Button
          variant="default"
          onClick={resetError}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={handleNavigateHome}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      name="route"
      level="feature"
      fallback={RouteErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
};
