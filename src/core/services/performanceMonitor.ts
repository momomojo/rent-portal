import { ReportHandler } from 'web-vitals';
import * as Sentry from '@sentry/react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: Set<(metric: PerformanceMetric) => void> = new Set();
  private thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    FCP: { good: 1800, poor: 3000 },
  };

  constructor() {
    this.initPerformanceObservers();
  }

  private initPerformanceObservers() {
    // Long Tasks Observer
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.reportPerformanceMetric({
              name: 'LONG_TASK',
              value: entry.duration,
              rating: this.getRating('LONG_TASK', entry.duration),
            });
          }
        }).observe({ entryTypes: ['longtask'] });

        // Resource Timing Observer
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
              this.reportPerformanceMetric({
                name: 'API_CALL',
                value: entry.duration,
                rating: this.getRating('API_CALL', entry.duration),
              });
            }
          }
        }).observe({ entryTypes: ['resource'] });

        // Layout Shift Observer
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              this.reportPerformanceMetric({
                name: 'LAYOUT_SHIFT',
                value: entry.value,
                rating: this.getRating('LAYOUT_SHIFT', entry.value),
              });
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.error('PerformanceObserver error:', e);
      }
    }
  }

  private getRating(
    metricName: string,
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metricName as keyof typeof this.thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  reportWebVitals: ReportHandler = (metric) => {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.name, metric.value),
      delta: metric.delta,
      navigationType: metric.navigationType,
    };

    this.reportPerformanceMetric(performanceMetric);
  };

  private reportPerformanceMetric(metric: PerformanceMetric) {
    // Store metric
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }
    this.metrics.get(metric.name)?.push(metric);

    // Notify observers
    this.observers.forEach((observer) => observer(metric));

    // Report to Sentry if performance is poor
    if (metric.rating === 'poor') {
      Sentry.captureMessage(`Poor performance detected: ${metric.name}`, {
        level: 'warning',
        extra: metric,
      });
    }
  }

  subscribe(callback: (metric: PerformanceMetric) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  getMetrics(metricName?: string) {
    if (metricName) {
      return this.metrics.get(metricName) || [];
    }
    return Array.from(this.metrics.entries()).reduce(
      (acc, [_, metrics]) => [...acc, ...metrics],
      [] as PerformanceMetric[]
    );
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();