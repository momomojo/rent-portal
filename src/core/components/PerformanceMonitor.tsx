/**
 * Performance Monitoring Dashboard
 * 
 * Provides real-time visualization of:
 * - Component load times
 * - Bundle sizes
 * - Network requests
 * - Memory usage
 */

import React, { useEffect, useState } from 'react';
import { trackComponentLoad } from '../monitoring/metrics';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [memory, setMemory] = useState<MemoryStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only initialize in development
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const newMetrics = entries.map(entry => ({
        name: entry.name,
        value: entry.duration,
        timestamp: Date.now()
      }));

      setMetrics(prev => [...prev, ...newMetrics].slice(-50)); // Keep last 50 metrics
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor memory usage if available
    const monitorMemory = () => {
      if ('memory' in performance) {
        setMemory({
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        });
      }
    };

    const intervalId = setInterval(monitorMemory, 1000);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
      <button
        className="absolute top-2 right-2 text-gray-500"
        onClick={() => setIsVisible(false)}
      >
        ×
      </button>
      
      <h2 className="text-lg font-semibold mb-4">Performance Monitor</h2>
      
      {memory && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Memory Usage</h3>
          <div className="space-y-1">
            <div>Used: {formatBytes(memory.usedJSHeapSize)}</div>
            <div>Total: {formatBytes(memory.totalJSHeapSize)}</div>
            <div>Limit: {formatBytes(memory.jsHeapSizeLimit)}</div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-medium mb-2">Recent Metrics</h3>
        <div className="space-y-2 max-h-60 overflow-auto">
          {metrics.map((metric, index) => (
            <div key={index} className="text-sm">
              <span className="font-mono">{metric.name}:</span>
              <span className="ml-2">{metric.value.toFixed(2)}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Development helper to toggle monitor
if (process.env.NODE_ENV === 'development') {
  window.__togglePerformanceMonitor = () => {
    const event = new CustomEvent('toggle-performance-monitor');
    window.dispatchEvent(event);
  };
}

export default PerformanceMonitor;
