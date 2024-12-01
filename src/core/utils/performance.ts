import { logger } from './logger';

interface PerformanceMetrics {
  [key: string]: {
    count: number;
    totalDuration: number;
    averageDuration: number;
    min: number;
    max: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private marks: { [key: string]: number } = {};

  // Start measuring
  start(name: string): void {
    this.marks[name] = performance.now();
  }

  // End measuring and record metrics
  end(name: string): void {
    const startTime = this.marks[name];
    if (!startTime) {
      logger.warn(`No start time found for performance measurement: ${name}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.recordMetric(name, duration);
    delete this.marks[name];
  }

  // Record a metric
  private recordMetric(name: string, duration: number): void {
    if (!this.metrics[name]) {
      this.metrics[name] = {
        count: 0,
        totalDuration: 0,
        averageDuration: 0,
        min: duration,
        max: duration,
      };
    }

    const metric = this.metrics[name];
    metric.count++;
    metric.totalDuration += duration;
    metric.averageDuration = metric.totalDuration / metric.count;
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);

    // Log to Sentry if performance is poor
    if (duration > 1000) { // 1 second threshold
      logger.warn('Poor performance detected', {
        metric: name,
        duration,
        average: metric.averageDuration,
      });
    }
  }

  // Get metrics for a specific measurement
  getMetrics(name: string): Partial<PerformanceMetrics[string]> | null {
    return this.metrics[name] || null;
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = {};
    this.marks = {};
  }

  // Measure function execution time
  async measure<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(name);
    }
  }

  // Record resource timing
  recordResourceTiming(): void {
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      const { name, duration, initiatorType } = resource;
      this.recordMetric(`resource-${initiatorType}-${name}`, duration);
    });
  }

  // Monitor long tasks
  monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          logger.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  // Monitor memory usage
  monitorMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          logger.warn('High memory usage detected', {
            used: memory.usedJSHeapSize,
            total: memory.jsHeapSizeLimit,
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
