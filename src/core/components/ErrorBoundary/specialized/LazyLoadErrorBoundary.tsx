import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { ErrorBoundaryProps } from '../types';
import { logger } from '../../../utils/logger';
import * as Sentry from '@sentry/react';

interface LazyLoadErrorState {
  hasError: boolean;
  error: Error | null;
}

export class LazyLoadErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  LazyLoadErrorState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if it's a chunk load error
    const isChunkLoadError = error.name === 'ChunkLoadError' || 
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk');

    if (isChunkLoadError) {
      logger.error('Chunk Load Error', {
        error,
        errorInfo,
        url: window.location.href
      });

      // Report to Sentry with specific context
      Sentry.withScope((scope) => {
        scope.setTag('error_type', 'chunk_load');
        scope.setContext('chunk_error', {
          url: window.location.href,
          timestamp: Date.now()
        });
        Sentry.captureException(error);
      });
    }
  }

  handleRetry = () => {
    // Clear module cache and retry
    if (window.__webpack_require__?.c) {
      window.__webpack_require__.c = {};
    }
    
    // Clear CSS cache if present
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === 'stylesheet') {
        const href = links[i].href.split('?')[0];
        links[i].href = href + '?t=' + Date.now();
      }
    }
    
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load component
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This might be due to a network issue or an outdated version of the application
          </Typography>
          <div className="space-x-3">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
            >
              Retry Loading
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Typography
              variant="caption"
              component="pre"
              sx={{
                mt: 4,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                maxWidth: '100%',
                overflow: 'auto'
              }}
            >
              {this.state.error.stack}
            </Typography>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}
