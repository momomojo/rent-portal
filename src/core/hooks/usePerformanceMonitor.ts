import { useEffect, useRef } from 'react';
import { logger } from '@core/utils/logger';
import { PERFORMANCE_BUDGETS } from '@core/config/performance-budgets';

interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  interactionTime: number;
}

export const usePerformanceMonitor = (
  componentName: string,
  type: 'listing' | 'detail' | 'search' | 'payment' = 'listing'
) => {
  const startTime = useRef(performance.now());
  const interactionTime = useRef<number | null>(null);
  const loadTime = useRef<number | null>(null);

  useEffect(() => {
    // Measure initial load time
    const load = performance.now() - startTime.current;
    loadTime.current = load;

    // Check against budgets
    const budget = type === 'listing' 
      ? PERFORMANCE_BUDGETS.timing.propertyListLoad
      : type === 'detail'
      ? PERFORMANCE_BUDGETS.timing.propertyDetailLoad
      : type === 'search'
      ? PERFORMANCE_BUDGETS.timing.searchResponse
      : PERFORMANCE_BUDGETS.timing.paymentProcess;

    if (load > budget) {
      logger.warn(
        `[Performance] ${componentName} load time (${load.toFixed(2)}ms) exceeded budget (${budget}ms)`
      );
    }

    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          logger.warn(
            `[Performance] Long task detected in ${componentName}: ${entry.duration.toFixed(2)}ms`
          );
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });

    // Monitor layout shifts
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.value > PERFORMANCE_BUDGETS.timing.CLS) {
          logger.warn(
            `[Performance] High layout shift detected in ${componentName}: ${entry.value}`
          );
        }
      });
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        if (resource.duration > PERFORMANCE_BUDGETS.timing.imageLoad) {
          logger.warn(
            `[Performance] Slow resource load in ${componentName}: ${resource.name} took ${resource.duration.toFixed(2)}ms`
          );
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
      resourceObserver.disconnect();
    };
  }, [componentName, type]);

  const measureInteraction = () => {
    interactionTime.current = performance.now() - startTime.current;
    if (interactionTime.current > PERFORMANCE_BUDGETS.timing.FID) {
      logger.warn(
        `[Performance] Slow interaction in ${componentName}: ${interactionTime.current.toFixed(2)}ms`
      );
    }
  };

  const getMetrics = (): PerformanceMetrics => ({
    renderTime: performance.now() - startTime.current,
    loadTime: loadTime.current || 0,
    interactionTime: interactionTime.current || 0,
  });

  return {
    measureInteraction,
    getMetrics,
  };
};

// Example usage:
/*
const PropertyListing = () => {
  const { measureInteraction, getMetrics } = usePerformanceMonitor('PropertyListing', 'listing');

  const handleClick = () => {
    measureInteraction();
    // Handle click
  };

  useEffect(() => {
    const metrics = getMetrics();
    // Log or analyze metrics
  }, []);

  return (
    <div onClick={handleClick}>
      // Component content
    </div>
  );
};
*/
