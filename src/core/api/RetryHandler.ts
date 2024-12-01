import { RetryConfig } from './types';
import { logger } from '../utils/logger';

export class RetryHandler {
  private readonly config: RetryConfig;

  constructor(config?: Partial<RetryConfig>) {
    this.config = {
      maxRetries: config?.maxRetries ?? 3,
      initialDelay: config?.initialDelay ?? 1000,
      maxDelay: config?.maxDelay ?? 8000,
      backoffFactor: config?.backoffFactor ?? 2
    };
  }

  async execute<T>(
    request: () => Promise<T>,
    shouldRetry: (error: any) => boolean = this.defaultShouldRetry
  ): Promise<T> {
    let lastError: Error;
    let delay = this.config.initialDelay;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await request();
      } catch (error: any) {
        lastError = error;

        if (attempt === this.config.maxRetries || !shouldRetry(error)) {
          throw error;
        }

        logger.warn('Request failed, retrying', {
          attempt,
          delay,
          error: error.message
        });

        await this.wait(delay);
        delay = Math.min(delay * this.config.backoffFactor, this.config.maxDelay);
      }
    }

    throw lastError!;
  }

  private defaultShouldRetry(error: any): boolean {
    // Retry on network errors and 5xx status codes
    if (!error.response) return true;
    const status = error.response?.status;
    return status >= 500 && status <= 599;
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
