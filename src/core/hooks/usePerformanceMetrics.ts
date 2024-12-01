/**
 * Custom hook for collecting and analyzing performance metrics
 * 
 * Features:
 * 1. Real-time performance monitoring
 * 2. Metric aggregation and analysis
 * 3. Performance budget tracking
 */

import { useEffect, useRef, useState } from 'react';
import { trackComponentLoad } from '../monitoring/metrics';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface PerformanceBudget {
  [key: string]: number; // Component name -> budget in ms
}

interface UsePerformanceMetricsOptions {
  budgets?: PerformanceBudget;
  onBudgetExceeded?: (metric: PerformanceMetric) => void;
  aggregationPeriod?: number; // in ms
}

export function usePerformanceMetrics(options: UsePerformanceMetricsOptions = {}) {
  const {
    budgets = {},
    onBudgetExceeded,
    aggregationPeriod = 5000 // 5 seconds default
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const metricsBuffer = useRef<PerformanceMetric[]>([]);
  const lastAggregation = useRef(Date.now());

  // Initialize performance monitoring
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        const metric: PerformanceMetric = {
          name: entry.name,
          value: entry.duration,
          timestamp: Date.now()
        };

        // Check performance budget
        const budget = budgets[entry.name];
        if (budget && entry.duration > budget) {
          onBudgetExceeded?.(metric);
        }

        // Add to buffer
        metricsBuffer.current.push(metric);
      });

      // Check if we should aggregate
      if (Date.now() - lastAggregation.current >= aggregationPeriod) {
        aggregateMetrics();
      }
    });

    observer.observe({ entryTypes: ['measure', 'resource', 'paint'] });

    const aggregationInterval = setInterval(() => {
      aggregateMetrics();
    }, aggregationPeriod);

    return () => {
      observer.disconnect();
      clearInterval(aggregationInterval);
    };
  }, [budgets, onBudgetExceeded, aggregationPeriod]);

  const aggregateMetrics = () => {
    if (metricsBuffer.current.length === 0) return;

    // Group metrics by name
    const grouped = metricsBuffer.current.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate aggregates
    const aggregated = Object.entries(grouped).map(([name, values]) => ({
      name,
      value: values.reduce((a, b) => a + b, 0) / values.length, // average
      timestamp: Date.now()
    }));

    setMetrics(prev => [...prev, ...aggregated].slice(-100)); // Keep last 100 aggregated metrics
    metricsBuffer.current = [];
    lastAggregation.current = Date.now();

    // Track aggregated metrics
    aggregated.forEach(metric => {
      trackComponentLoad(`${metric.name}-aggregate`, metric.value);
    });
  };

  const getMetricsByComponent = (componentName: string) => {
    return metrics.filter(m => m.name.includes(componentName));
  };

  const getAverageMetric = (componentName: string) => {
    const componentMetrics = getMetricsByComponent(componentName);
    if (componentMetrics.length === 0) return 0;
    
    return componentMetrics.reduce((acc, m) => acc + m.value, 0) / componentMetrics.length;
  };

  return {
    metrics,
    getMetricsByComponent,
    getAverageMetric,
    aggregateMetrics
  };
}
