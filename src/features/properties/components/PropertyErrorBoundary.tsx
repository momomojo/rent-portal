import React from 'react';
import * as Sentry from '@sentry/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';

interface PropertyErrorBoundaryProps {
  children: React.ReactNode;
}

export const PropertyErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: PropertyErrorBoundaryProps) => children,
  {
    fallback: ({ error, resetError }) => (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Properties</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred while loading properties'}
          </AlertDescription>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={resetError}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Alert>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
            {error.stack}
          </pre>
        )}
      </div>
    ),
    beforeCapture: (scope) => {
      scope.setTag('feature', 'properties');
    },
  }
);