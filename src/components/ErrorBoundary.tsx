import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="p-6 space-y-6">
              <Alert variant="destructive">
                <Typography variant="h6">
                  Something went wrong
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </Typography>
              </Alert>
              <div className="flex justify-center">
                <Button onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;