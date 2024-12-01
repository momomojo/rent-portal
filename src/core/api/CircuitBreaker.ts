import { CircuitBreakerState, CircuitBreakerConfig } from './types';
import { logger } from '../utils/logger';

export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failures = 0;
  private lastFailureTime?: number;
  private successfulHalfOpenRequests = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: config?.failureThreshold ?? 5,
      resetTimeout: config?.resetTimeout ?? 60000, // 60 seconds
      halfOpenRequests: config?.halfOpenRequests ?? 3
    };
  }

  async execute<T>(request: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await request();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    const timeElapsed = Date.now() - this.lastFailureTime;
    return timeElapsed >= this.config.resetTimeout;
  }

  private transitionToHalfOpen(): void {
    this.state = 'HALF_OPEN';
    this.successfulHalfOpenRequests = 0;
    logger.info('Circuit breaker transitioning to HALF_OPEN state');
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successfulHalfOpenRequests++;
      if (this.successfulHalfOpenRequests >= this.config.halfOpenRequests) {
        this.reset();
      }
    } else if (this.state === 'CLOSED') {
      this.failures = Math.max(0, this.failures - 1); // Gradual recovery
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.failures >= this.config.failureThreshold) {
      this.trip();
    }

    logger.warn('Circuit breaker failure recorded', {
      failures: this.failures,
      state: this.state,
      threshold: this.config.failureThreshold
    });
  }

  private trip(): void {
    this.state = 'OPEN';
    logger.warn('Circuit breaker tripped to OPEN state');
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.successfulHalfOpenRequests = 0;
    logger.info('Circuit breaker reset to CLOSED state');
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getFailures(): number {
    return this.failures;
  }
}
