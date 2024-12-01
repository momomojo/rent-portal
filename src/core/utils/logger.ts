import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
if (process.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    environment: process.env.NODE_ENV,
  });
}

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${
      metadata ? '\n' + JSON.stringify(metadata, null, 2) : ''
    }`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    return level !== 'debug';
  }

  private captureException(error: Error, metadata?: LogMetadata): void {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: metadata,
      });
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, metadata));
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, metadata));
    }
  }

  warn(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, metadata));
      if (process.env.VITE_SENTRY_DSN) {
        Sentry.captureMessage(message, {
          level: 'warning',
          extra: metadata,
        });
      }
    }
  }

  error(message: string, metadata?: LogMetadata & { error?: Error }): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, metadata));
      if (metadata?.error) {
        this.captureException(metadata.error, metadata);
      } else {
        if (process.env.VITE_SENTRY_DSN) {
          Sentry.captureMessage(message, {
            level: 'error',
            extra: metadata,
          });
        }
      }
    }
  }

  // Performance monitoring
  startPerformanceTrace(name: string): () => void {
    if (!process.env.VITE_SENTRY_DSN) return () => {};

    const transaction = Sentry.startTransaction({
      name,
    });

    return () => {
      transaction.finish();
    };
  }

  // User tracking
  setUser(id: string, email?: string, username?: string): void {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.setUser({
        id,
        email,
        username,
      });
    }
  }

  clearUser(): void {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.setUser(null);
    }
  }

  // Context tracking
  setContext(name: string, context: Record<string, any>): void {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.setContext(name, context);
    }
  }

  // Tag tracking
  setTag(key: string, value: string): void {
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.setTag(key, value);
    }
  }
}

export const logger = new Logger();
