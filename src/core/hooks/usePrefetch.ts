import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackComponentLoad } from '../monitoring/metrics';

interface UserBehaviorMetric {
  path: string;
  timestamp: number;
  timeSpent: number;
  interactions: number;
}

interface PrefetchOptions {
  condition?: () => boolean;
  threshold?: number;
  maxPrefetch?: number;
}

class UserBehaviorAnalyzer {
  private static instance: UserBehaviorAnalyzer;
  private metrics: Map<string, UserBehaviorMetric[]> = new Map();
  private predictions: Map<string, string[]> = new Map();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserBehaviorAnalyzer();
    }
    return this.instance;
  }

  addMetric(path: string, timeSpent: number, interactions: number) {
    if (!this.metrics.has(path)) {
      this.metrics.set(path, []);
    }
    
    const pathMetrics = this.metrics.get(path)!;
    pathMetrics.push({
      path,
      timestamp: Date.now(),
      timeSpent,
      interactions
    });

    // Keep only last 10 metrics per path
    if (pathMetrics.length > 10) {
      pathMetrics.shift();
    }

    this.updatePredictions(path);
  }

  private updatePredictions(currentPath: string) {
    const allMetrics = Array.from(this.metrics.values()).flat();
    const pathSequences = new Map<string, number>();

    // Analyze path sequences
    for (let i = 1; i < allMetrics.length; i++) {
      const prevPath = allMetrics[i - 1].path;
      const nextPath = allMetrics[i].path;
      const sequence = `${prevPath}->${nextPath}`;
      pathSequences.set(sequence, (pathSequences.get(sequence) || 0) + 1);
    }

    // Calculate most likely next paths
    const predictions = Array.from(pathSequences.entries())
      .filter(([sequence]) => sequence.startsWith(`${currentPath}->`))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sequence]) => sequence.split('->')[1]);

    this.predictions.set(currentPath, predictions);
  }

  getPredictedPaths(currentPath: string): string[] {
    return this.predictions.get(currentPath) || [];
  }
}

export const usePrefetch = (options: PrefetchOptions = {}) => {
  const {
    condition = () => true,
    threshold = 0.7, // Probability threshold
    maxPrefetch = 3
  } = options;

  const location = useLocation();
  const navigate = useNavigate();
  const startTime = useRef(Date.now());
  const interactions = useRef(0);
  const analyzer = UserBehaviorAnalyzer.getInstance();

  // Track user interactions
  useEffect(() => {
    const trackInteraction = () => {
      interactions.current++;
    };

    window.addEventListener('click', trackInteraction);
    window.addEventListener('scroll', trackInteraction);

    return () => {
      window.removeEventListener('click', trackInteraction);
      window.removeEventListener('scroll', trackInteraction);
    };
  }, []);

  // Track page visits and update metrics
  useEffect(() => {
    const timeSpent = Date.now() - startTime.current;
    analyzer.addMetric(location.pathname, timeSpent, interactions.current);

    // Reset counters
    startTime.current = Date.now();
    interactions.current = 0;
  }, [location.pathname]);

  // Prefetch predicted routes
  const prefetchPredictedRoutes = useCallback(async () => {
    if (!condition()) return;

    const predictedPaths = analyzer.getPredictedPaths(location.pathname);
    const routesToPrefetch = predictedPaths.slice(0, maxPrefetch);

    for (const path of routesToPrefetch) {
      try {
        // Start prefetch timing
        const startPrefetch = performance.now();

        // Dynamically import the component for the route
        const module = await import(`@features${path}`).catch(() => null);
        
        if (module) {
          const endPrefetch = performance.now();
          trackComponentLoad(`prefetch-${path}`, endPrefetch - startPrefetch);
        }
      } catch (error) {
        console.debug(`Prefetch failed for ${path}:`, error);
      }
    }
  }, [location.pathname, condition, maxPrefetch]);

  // Return utility functions
  return {
    prefetchPredictedRoutes,
    getPredictedPaths: () => analyzer.getPredictedPaths(location.pathname)
  };
};
