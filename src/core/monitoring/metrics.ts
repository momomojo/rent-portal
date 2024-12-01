import { initializeApp } from 'firebase/analytics';

interface PerformanceMetric {
  componentName: string;
  loadTime: number;
  timestamp: number;
  memoryUsage?: number;
  networkInfo?: {
    effectiveType: string;
    rtt: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxMetrics: number = 50;

  constructor() {
    if (typeof window !== 'undefined') {
      setInterval(() => this.flushMetrics(), this.flushInterval);
      this.observeNetworkChanges();
    }
  }

  private getNetworkInfo() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType,
        rtt: conn.rtt
      };
    }
    return undefined;
  }

  private getMemoryInfo() {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  private observeNetworkChanges() {
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', () => {
        this.trackMetric('network-change', {
          networkInfo: this.getNetworkInfo()
        });
      });
    }
  }

  public trackComponentLoad(componentName: string, loadTime: number) {
    const metric: PerformanceMetric = {
      componentName,
      loadTime,
      timestamp: Date.now(),
      memoryUsage: this.getMemoryInfo(),
      networkInfo: this.getNetworkInfo()
    };

    this.metrics.push(metric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Performance metric:', metric);
    }

    // Flush if we've collected too many metrics
    if (this.metrics.length >= this.maxMetrics) {
      this.flushMetrics();
    }
  }

  public trackMetric(name: string, data: Record<string, any>) {
    const metric = {
      name,
      timestamp: Date.now(),
      ...data
    };

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        ...data
      });
    }
  }

  private async flushMetrics() {
    if (this.metrics.length === 0) return;

    try {
      // Send to your analytics service
      if (window.gtag) {
        window.gtag('event', 'performance_metrics_batch', {
          metrics: this.metrics
        });
      }

      // Log performance marks
      this.metrics.forEach(metric => {
        performance.mark(`${metric.componentName}-${metric.timestamp}`);
      });

      // Clear metrics after successful send
      this.metrics = [];
    } catch (error) {
      console.error('Failed to flush metrics:', error);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const trackComponentLoad = (componentName: string, loadTime: number) => {
  performanceMonitor.trackComponentLoad(componentName, loadTime);
};
