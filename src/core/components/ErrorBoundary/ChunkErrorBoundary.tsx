import React from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from './ErrorBoundary';
import { RefreshIcon } from 'lucide-react';

interface ChunkErrorBoundaryProps {
  children: React.ReactNode;
}

export const ChunkErrorBoundary: React.FC<ChunkErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div className="p-4 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Failed to load this section. Please try again.
          </p>
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            className="gap-2"
          >
            <RefreshIcon className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
