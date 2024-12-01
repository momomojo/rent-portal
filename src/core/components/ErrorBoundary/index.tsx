import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Card, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

interface Props {
  name?: string;
  level?: 'root' | 'route' | 'component';
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class BaseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`ErrorBoundary (${this.props.name || 'unnamed'}) caught an error:`, error, errorInfo);
    }

    // Send error to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope(scope => {
        scope.setExtra('componentStack', errorInfo.componentStack);
        scope.setTag('boundary-name', this.props.name || 'unnamed');
        scope.setTag('boundary-level', this.props.level || 'component');
        Sentry.captureException(error);
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 m-4 max-w-lg mx-auto">
          <Alert severity="error" className="mb-4">
            <Typography variant="h6" component="h2" className="mb-2">
              {this.props.level === 'root' 
                ? 'Application Error'
                : this.props.level === 'route'
                ? 'Page Error'
                : 'Component Error'}
            </Typography>
            <Typography variant="body2" className="mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
          </Alert>
          
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
              <code>
                {this.state.errorInfo.componentStack}
              </code>
            </pre>
          )}

          <div className="mt-4 flex gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries
export const ErrorBoundary = (props: Props) => (
  <BaseErrorBoundary {...props} level="component" />
);

export const RouteErrorBoundary = (props: Props) => (
  <BaseErrorBoundary {...props} level="route" />
);

export const AuthErrorBoundary = (props: Props) => (
  <BaseErrorBoundary 
    {...props} 
    name="auth"
    level="component"
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          <Typography variant="h5" component="h2" className="text-center mb-4">
            Authentication Error
          </Typography>
          <Typography variant="body2" color="text.secondary" className="text-center mb-6">
            There was a problem with authentication. Please try again.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Card>
      </div>
    }
  />
);

// Chunk loading error boundary
export const ChunkErrorBoundary = (props: Props) => (
  <BaseErrorBoundary
    {...props}
    name="chunk-load"
    level="component"
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="max-w-md w-full p-8">
          <Typography variant="h5" component="h2" className="text-center mb-4">
            Loading Error
          </Typography>
          <Typography variant="body2" color="text.secondary" className="text-center mb-6">
            Failed to load page component. This might be due to a network issue.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Card>
      </div>
    }
  />
);