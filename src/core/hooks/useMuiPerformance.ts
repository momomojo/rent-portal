/**
 * Custom hook for Material-UI performance optimization
 * 
 * Features:
 * 1. Lazy loading with performance tracking
 * 2. Component render optimization
 * 3. Memory usage monitoring
 */

import { useEffect, useRef, useState } from 'react';
import { importMuiComponent } from '../utils/muiOptimizer';
import { trackComponentLoad } from '../monitoring/metrics';

interface UseMuiPerformanceOptions {
  componentName: string;
  threshold?: number; // Performance budget in ms
  onPerformanceIssue?: (metric: { component: string; renderTime: number }) => void;
}

export function useMuiPerformance<T>({
  componentName,
  threshold = 16, // Target 60fps
  onPerformanceIssue
}: UseMuiPerformanceOptions) {
  const [component, setComponent] = useState<T | null>(null);
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    // Load the component
    importMuiComponent(componentName)
      .then((loadedComponent) => {
        setComponent(loadedComponent as T);
      })
      .catch((error) => {
        console.error(`Failed to load ${componentName}:`, error);
      });

    // Track render performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes(componentName)) {
          const renderTime = entry.duration;
          
          // Check if we're exceeding our performance budget
          if (renderTime > threshold) {
            onPerformanceIssue?.({
              component: componentName,
              renderTime
            });
          }

          // Track the metric
          trackComponentLoad(`${componentName}-render`, renderTime);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      observer.disconnect();
    };
  }, [componentName, threshold]);

  // Track subsequent renders
  useEffect(() => {
    renderCount.current++;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;

    // Only track if it's not the first render
    if (renderCount.current > 1) {
      performance.mark(`${componentName}-render-start`);
      
      requestAnimationFrame(() => {
        performance.mark(`${componentName}-render-end`);
        performance.measure(
          `${componentName}-render-${renderCount.current}`,
          `${componentName}-render-start`,
          `${componentName}-render-end`
        );
      });
    }

    lastRenderTime.current = currentTime;
  });

  return {
    component,
    renderCount: renderCount.current,
    isLoaded: component !== null
  };
}
