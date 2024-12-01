import { ErrorInfo } from 'react';

export type ErrorBoundaryLevel = 'root' | 'feature' | 'component';

export interface ErrorBoundaryProps {
  name: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetCondition?: unknown;
  level: ErrorBoundaryLevel;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorMetadata {
  timestamp: number;
  componentStack?: string;
  level: ErrorBoundaryLevel;
  boundaryName: string;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
  boundaryName: string;
  level: ErrorBoundaryLevel;
}
