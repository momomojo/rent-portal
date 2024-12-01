import React from 'react';
import * as Sentry from '@sentry/react';
import { ErrorBoundaryProps, ErrorBoundaryState, ErrorMetadata } from './types';
import { DefaultErrorFallback } from './DefaultErrorFallback';
import { logger } from '../../utils/logger';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { name, level } = this.props;
    
    const errorMetadata: ErrorMetadata = {
      timestamp: Date.now(),
      componentStack: errorInfo.componentStack,
      level,
      boundaryName: name
    };

    // Log to Sentry with enhanced context
    Sentry.withScope((scope) => {
      scope.setTag('boundary_name', name);
      scope.setTag('boundary_level', level);
      scope.setContext('error_boundary', errorMetadata);
      Sentry.captureException(error);
    });

    // Log to our logging service
    logger.error('React Error Boundary caught an error:', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      metadata: errorMetadata
    });

    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if resetCondition changes
    if (
      this.state.hasError &&
      this.props.resetCondition !== prevProps.resetCondition
    ) {
      this.resetError();
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, name, level } = this.props;

    if (hasError && error) {
      const FallbackComponent = fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          boundaryName={name}
          level={level}
        />
      );
    }

    return children;
  }
}
