export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRequests: number;
}

export interface ApiErrorMetadata {
  timestamp: number;
  endpoint: string;
  method: string;
  retryCount: number;
  circuitBreakerState: CircuitBreakerState;
}

export interface ApiRequestConfig {
  endpoint: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retryConfig?: Partial<RetryConfig>;
  skipCircuitBreaker?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public metadata?: ApiErrorMetadata
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
