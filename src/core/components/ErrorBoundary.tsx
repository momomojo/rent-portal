import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import * as Sentry from '@sentry/react';
import { logger } from '@core/utils/logger';
import { Button } from "@shared/components/Button/index";

interface Props extends PropsWithChildren {
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to Sentry
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Log to our logging service
    logger.error('React Error Boundary caught an error:', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  private handleReportFeedback = (): void => {
    Sentry.showReportDialog({
      eventId: Sentry.lastEventId(),
    });
  };

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <Button
                onClick={this.handleReset}
                variant="primary"
                fullWidth
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReportFeedback}
                variant="secondary"
                fullWidth
              >
                Report Feedback
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                fullWidth
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
