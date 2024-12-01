import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ErrorFallbackProps } from './types';
import { RefreshIcon, BugIcon } from 'lucide-react';

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  boundaryName,
  level,
  componentStack,
}) => {
  const isRootError = level === 'root';
  const severity = isRootError ? 'error' : 'warning';

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReport = () => {
    // Implement error reporting logic here
    console.error('Error reported:', error);
    resetErrorBoundary();
  };

  return (
    <div className="p-4">
      <Alert variant={severity}>
        <div className="flex flex-col gap-4">
          <Typography variant="h5">
            {isRootError ? 'Application Error' : `Error in ${boundaryName}`}
          </Typography>
          <Typography variant="body1" className="text-destructive-foreground/90">
            {error.message || 'An unexpected error occurred'}
          </Typography>
          {process.env.NODE_ENV === 'development' && error.stack && (
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-destructive/10 p-2 text-sm">
              <code>{error.stack}</code>
            </pre>
          )}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="gap-2"
            >
              <RefreshIcon className="h-4 w-4" />
              Try Again
            </Button>
            {isRootError && (
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="gap-2"
              >
                <RefreshIcon className="h-4 w-4" />
                Reload Application
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};
