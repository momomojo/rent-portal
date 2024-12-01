import { logger } from './logger';

interface PerformanceMetrics {
  FCP: number | null;
  LCP: number | null;
  CLS: number | null;
  FID: number | null;
  TTFB: number | null;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    FCP: null,
    LCP: null,
    CLS: null,
    FID: null,
    TTFB: null,
  };

  private readonly performanceBudget = {
    FCP: 2000, // 2 seconds
    LCP: 2500, // 2.5 seconds
    CLS: 0.1, // 0.1 or less
    FID: 100, // 100ms
    TTFB: 600, // 600ms
  };

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    // First Contentful Paint
    this.observeFCP();

    // Largest Contentful Paint
    this.observeLCP();

    // Cumulative Layout Shift
    this.observeCLS();

    // First Input Delay
    this.observeFID();

    // Time to First Byte
    this.measureTTFB();
  }

  private observeFCP(): void {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0];
        this.metrics.FCP = fcp.startTime;
        this.checkBudget('FCP', fcp.startTime);
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  private observeLCP(): void {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
      this.checkBudget('LCP', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeCLS(): void {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as LayoutShift[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      this.metrics.CLS = clsValue;
      this.checkBudget('CLS', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeFID(): void {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0];
        this.metrics.FID = firstInput.processingStart - firstInput.startTime;
        this.checkBudget('FID', this.metrics.FID);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  private measureTTFB(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      this.checkBudget('TTFB', this.metrics.TTFB);
    }
  }

  private checkBudget(metric: keyof PerformanceMetrics, value: number): void {
    const budget = this.performanceBudget[metric];
    if (value > budget) {
      logger.warn(
        `Performance budget exceeded for ${metric}: ${value}ms (budget: ${budget}ms)`
      );
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public measureResourceTiming(): void {
    const resources = performance.getEntriesByType('resource');
    resources.forEach((resource) => {
      const timing = resource as PerformanceResourceTiming;
      if (timing.duration > 1000) {
        logger.warn(
          `Slow resource load: ${timing.name} took ${timing.duration}ms`
        );
      }
    });
  }

  public measureRouteChange(routeName: string): void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 100) {
        logger.warn(
          `Slow route transition to ${routeName}: ${duration.toFixed(2)}ms`
        );
      }
    };
  }

  public measureComponentRender(componentName: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 16.67) { // One frame at 60fps
        logger.warn(
          `Slow render in ${componentName}: ${duration.toFixed(2)}ms`
        );
      }
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
