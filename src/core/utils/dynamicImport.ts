import { lazy } from 'react';

interface ImportMetrics {
  componentPath: string;
  loadTime: number;
  timestamp: number;
}

const metricsQueue: ImportMetrics[] = [];

export const flushMetrics = () => {
  if (metricsQueue.length > 0) {
    // Send metrics to your analytics service
    console.log('Component load metrics:', metricsQueue);
    metricsQueue.length = 0;
  }
};

export const importComponent = <T extends React.ComponentType<any>>(
  path: string,
  importFn: () => Promise<{ default: T }>
) => {
  return lazy(() => {
    performance.mark(`import-${path}-start`);
    
    return importFn().then(module => {
      performance.mark(`import-${path}-end`);
      const measure = performance.measure(
        `import-${path}`,
        `import-${path}-start`,
        `import-${path}-end`
      );

      metricsQueue.push({
        componentPath: path,
        loadTime: measure.duration,
        timestamp: Date.now()
      });

      // Flush metrics if queue gets too large
      if (metricsQueue.length >= 10) {
        flushMetrics();
      }

      return module;
    });
  });
};

// Set up periodic metrics flushing
if (typeof window !== 'undefined') {
  setInterval(flushMetrics, 30000); // Flush every 30 seconds
}
