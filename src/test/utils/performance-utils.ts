import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  renderTime: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  resourceLoadTime: number;
}

export class PerformanceMonitor {
  private startTime: number;
  private metrics: Partial<PerformanceMetrics>;

  constructor() {
    this.startTime = performance.now();
    this.metrics = {};
  }

  measureRenderTime(): number {
    const renderTime = performance.now() - this.startTime;
    this.metrics.renderTime = renderTime;
    return renderTime;
  }

  async measureFirstContentfulPaint(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntriesByName('first-contentful-paint');
        if (entries.length > 0) {
          const fcp = entries[0].startTime;
          this.metrics.firstContentfulPaint = fcp;
          observer.disconnect();
          resolve(fcp);
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    });
  }

  async measureTimeToInteractive(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const tti = list.getEntries()[0].startTime;
        this.metrics.timeToInteractive = tti;
        observer.disconnect();
        resolve(tti);
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    });
  }

  measureResourceLoadTime(): number {
    const resources = performance.getEntriesByType('resource');
    const totalLoadTime = resources.reduce((total, resource) => {
      return total + resource.duration;
    }, 0);
    
    this.metrics.resourceLoadTime = totalLoadTime;
    return totalLoadTime;
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return this.metrics;
  }

  clearMetrics(): void {
    performance.clearMarks();
    performance.clearMeasures();
    performance.clearResourceTimings();
    this.metrics = {};
  }
}

export const performanceThresholds = {
  renderTime: 100, // ms
  firstContentfulPaint: 1000, // ms
  timeToInteractive: 2000, // ms
  resourceLoadTime: 3000 // ms
};

export function assertPerformanceMetrics(metrics: Partial<PerformanceMetrics>): void {
  Object.entries(metrics).forEach(([metric, value]) => {
    const threshold = performanceThresholds[metric as keyof typeof performanceThresholds];
    if (threshold && value) {
      expect(value).toBeLessThanOrEqual(
        threshold,
        `${metric} exceeded threshold: ${value}ms > ${threshold}ms`
      );
    }
  });
}
