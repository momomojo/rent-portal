import { webVitals } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
  timestamp: number;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private observers: Set<(metrics: PerformanceMetric[]) => void> = new Set();

  constructor() {
    this.initWebVitals();
    this.initPerformanceObserver();
  }

  private initWebVitals() {
    webVitals.getFCP(this.handleMetric.bind(this));
    webVitals.getLCP(this.handleMetric.bind(this));
    webVitals.getFID(this.handleMetric.bind(this));
    webVitals.getCLS(this.handleMetric.bind(this));
    webVitals.getTTFB(this.handleMetric.bind(this));
  }

  private initPerformanceObserver() {
    // Track long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.logMetric('long-task', entry.duration, {
            startTime: entry.startTime,
            detail: entry.toJSON(),
          });
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Track resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            this.logMetric('api-call', entry.duration, {
              url: entry.name,
              initiatorType: entry.initiatorType,
            });
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  private handleMetric(metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
    };

    this.metrics.push(performanceMetric);
    this.notifyObservers();
  }

  private logMetric(name: string, value: number, metadata: Record<string, any> = {}) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: this.getRating(name, value),
      timestamp: Date.now(),
      ...metadata,
    };

    this.metrics.push(metric);
    this.notifyObservers();
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      'long-task': { good: 50, poor: 100 },
      'api-call': { good: 500, poor: 2000 },
      // Add more thresholds as needed
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private notifyObservers() {
    this.observers.forEach((observer) => observer(this.metrics));
  }

  subscribe(callback: (metrics: PerformanceMetric[]) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  getMetrics() {
    return this.metrics;
  }

  getMetricsByName(name: string) {
    return this.metrics.filter((metric) => metric.name === name);
  }

  getLatestMetric(name: string) {
    return this.metrics
      .filter((metric) => metric.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  clearMetrics() {
    this.metrics = [];
    this.notifyObservers();
  }
}

export const performanceService = new PerformanceService();

// Helper hook for monitoring specific metrics
export function usePerformanceMetric(metricName: string) {
  const [metric, setMetric] = React.useState<PerformanceMetric | null>(
    performanceService.getLatestMetric(metricName) || null
  );

  React.useEffect(() => {
    return performanceService.subscribe((metrics) => {
      const latest = metrics
        .filter((m) => m.name === metricName)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      if (latest) setMetric(latest);
    });
  }, [metricName]);

  return metric;
}