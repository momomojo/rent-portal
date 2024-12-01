import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Don't send errors in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
    });
  }
};

export const withSentryErrorBoundary = (WrappedComponent: React.ComponentType) => {
  return Sentry.withErrorBoundary(WrappedComponent, {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                <code>{componentStack}</code>
              </pre>
            )}
          </div>
          <div className="mt-8">
            <button
              onClick={resetError}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    ),
  });
};