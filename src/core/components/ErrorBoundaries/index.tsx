import React from 'react';
import * as Sentry from '@sentry/react';
import { Alert, AlertTitle, AlertDescription, Button } from '@/components/ui';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';

// Base error boundary component
export const BaseErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => <>{children}</>,
  {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="p-6 m-4 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
        <Alert variant="error">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Something went wrong</AlertTitle>
          </div>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
        
        {process.env.NODE_ENV === 'development' && componentStack && (
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
            <code>{componentStack}</code>
          </pre>
        )}

        <Button
          className="mt-4"
          onClick={resetError}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    ),
  }
);

// Authentication error boundary
export const AuthErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => <>{children}</>,
  {
    fallback: ({ resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-4">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-gray-600">
              There was a problem with authentication. Please try again.
            </p>
          </div>
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={resetError}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    ),
  }
);

// Chunk loading error boundary
export const ChunkErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => <>{children}</>,
  {
    fallback: ({ error }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Error
            </h2>
            <p className="text-gray-600">
              {error?.message || 'Failed to load page component. This might be due to a network issue.'}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    ),
  }
);

// Route error boundary
export const RouteErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => <>{children}</>,
  {
    fallback: ({ error, resetError }) => (
      <div className="p-6 m-4 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
        <Alert variant="error">
          <AlertTitle>Page Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'An error occurred while loading this page'}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 flex gap-4">
          <Button
            onClick={resetError}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    ),
  }
);