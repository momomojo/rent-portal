import React, { useEffect, useRef, ComponentType } from 'react';
import { trackComponentLoad } from './metrics';

interface ComponentMetrics {
  renderTime: number;
  memoryDelta?: number;
  renderCount: number;
  lastRenderTimestamp: number;
  averageRenderTime: number;
  peakMemoryUsage?: number;
  renderTimeHistory: number[];
  memoryHistory?: number[];
}

class MUIPerformanceMonitor {
  private metrics: Map<string, ComponentMetrics> = new Map();
  private readonly MAX_HISTORY_LENGTH = 100;

  trackRender(
    componentName: string,
    metrics: { renderTime: number; memoryDelta?: number }
  ) {
    const existing = this.metrics.get(componentName) || {
      renderTime: 0,
      renderCount: 0,
      lastRenderTimestamp: 0,
      averageRenderTime: 0,
      renderTimeHistory: [],
      memoryHistory: []
    };

    const newRenderTimeHistory = [...existing.renderTimeHistory, metrics.renderTime]
      .slice(-this.MAX_HISTORY_LENGTH);

    const newMemoryHistory = metrics.memoryDelta 
      ? [...(existing.memoryHistory || []), metrics.memoryDelta].slice(-this.MAX_HISTORY_LENGTH)
      : existing.memoryHistory;

    const newMetrics: ComponentMetrics = {
      renderTime: metrics.renderTime,
      memoryDelta: metrics.memoryDelta,
      renderCount: existing.renderCount + 1,
      lastRenderTimestamp: Date.now(),
      averageRenderTime: newRenderTimeHistory.reduce((a, b) => a + b, 0) / newRenderTimeHistory.length,
      peakMemoryUsage: newMemoryHistory 
        ? Math.max(...newMemoryHistory)
        : existing.peakMemoryUsage,
      renderTimeHistory: newRenderTimeHistory,
      memoryHistory: newMemoryHistory
    };

    this.metrics.set(componentName, newMetrics);
    trackComponentLoad(`mui-${componentName}`, metrics.renderTime);
  }

  getComponentMetrics(componentName: string): ComponentMetrics | undefined {
    return this.metrics.get(componentName);
  }

  getAllMetrics(): Map<string, ComponentMetrics> {
    return new Map(this.metrics);
  }

  getPerformanceReport(): { 
    slowestComponents: Array<{ name: string; averageRenderTime: number }>;
    highestMemoryUsage: Array<{ name: string; peakMemoryUsage: number }>;
  } {
    const components = Array.from(this.metrics.entries());
    
    const slowestComponents = components
      .sort((a, b) => b[1].averageRenderTime - a[1].averageRenderTime)
      .slice(0, 5)
      .map(([name, metrics]) => ({
        name,
        averageRenderTime: metrics.averageRenderTime
      }));

    const highestMemoryUsage = components
      .filter(([_, metrics]) => metrics.peakMemoryUsage !== undefined)
      .sort((a, b) => (b[1].peakMemoryUsage || 0) - (a[1].peakMemoryUsage || 0))
      .slice(0, 5)
      .map(([name, metrics]) => ({
        name,
        peakMemoryUsage: metrics.peakMemoryUsage || 0
      }));

    return {
      slowestComponents,
      highestMemoryUsage
    };
  }
}

export const muiPerformanceMonitor = new MUIPerformanceMonitor();

export function withPerformanceTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
): React.FC<P> {
  return React.memo((props: P) => {
    const startTime = useRef(performance.now());
    const memoryStart = useRef(
      typeof performance !== 'undefined' && 'memory' in performance
        ? (performance as any).memory?.usedJSHeapSize
        : undefined
    );
    const renderCount = useRef(0);

    useEffect(() => {
      const renderTime = performance.now() - startTime.current;
      const memoryDelta =
        typeof performance !== 'undefined' &&
        'memory' in performance &&
        (performance as any).memory?.usedJSHeapSize !== undefined
          ? (performance as any).memory.usedJSHeapSize - (memoryStart.current || 0)
          : undefined;

      renderCount.current++;
      
      muiPerformanceMonitor.trackRender(componentName, {
        renderTime,
        memoryDelta
      });

      // Start tracking for next render
      startTime.current = performance.now();
      memoryStart.current =
        typeof performance !== 'undefined' && 'memory' in performance
          ? (performance as any).memory?.usedJSHeapSize
          : undefined;
    });

    return <WrappedComponent {...props} />;
  });
}
