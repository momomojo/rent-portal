import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import * as Sentry from '@sentry/react';

// Mock Sentry
jest.mock('@sentry/react', () => ({
  withScope: jest.fn((cb) => cb({ setTag: jest.fn(), setContext: jest.fn() })),
  captureException: jest.fn()
}));

// Mock logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary name="test" level="component">
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch render errors and display fallback UI', () => {
    render(
      <ErrorBoundary name="test" level="component">
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('should reset error state when resetCondition changes', () => {
    const { rerender } = render(
      <ErrorBoundary name="test" level="component" resetCondition={1}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    rerender(
      <ErrorBoundary name="test" level="component" resetCondition={2}>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should call error reporting service when error occurs', () => {
    render(
      <ErrorBoundary name="test" level="component">
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('should call custom onError handler if provided', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary name="test" level="component" onError={onError}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('should allow error recovery through retry button', () => {
    const { rerender } = render(
      <ErrorBoundary name="test" level="component">
        <ErrorComponent />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText(/Try Again/i);
    
    rerender(
      <ErrorBoundary name="test" level="component">
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.click(retryButton);
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
