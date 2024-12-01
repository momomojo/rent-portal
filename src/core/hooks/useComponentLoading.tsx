import { useEffect, useRef } from 'react';
import { trackComponentLoad } from '../monitoring/metrics';

interface UseComponentLoadingOptions {
  threshold?: number; // Loading time threshold in ms
  onLoadingComplete?: () => void;
  onLoadingError?: (error: Error) => void;
  onLoadingThresholdExceeded?: () => void;
}

export const useComponentLoading = (
  componentName: string,
  options: UseComponentLoadingOptions = {}
) => {
  const startTime = useRef<number>(0);
  const {
    threshold = 3000,
    onLoadingComplete,
    onLoadingError,
    onLoadingThresholdExceeded
  } = options;

  useEffect(() => {
    startTime.current = performance.now();

    // Create a performance mark for the start of loading
    performance.mark(`${componentName}-start`);

    // Set up a threshold warning
    const timeoutId = setTimeout(() => {
      const currentLoadTime = performance.now() - startTime.current;
      if (currentLoadTime >= threshold) {
        onLoadingThresholdExceeded?.();
        trackComponentLoad(componentName, currentLoadTime);
      }
    }, threshold);

    return () => {
      // Component has mounted or unmounted
      const loadTime = performance.now() - startTime.current;
      
      // Create performance mark and measure
      try {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-load`,
          `${componentName}-start`,
          `${componentName}-end`
        );
      } catch (error) {
        console.error('Error creating performance measure:', error);
      }

      // Track the loading time
      trackComponentLoad(componentName, loadTime);

      // Cleanup
      clearTimeout(timeoutId);
      onLoadingComplete?.();
    };
  }, [componentName]);

  // Return a function to manually report errors
  const reportError = (error: Error) => {
    const loadTime = performance.now() - startTime.current;
    trackComponentLoad(`${componentName}-error`, loadTime);
    onLoadingError?.(error);
  };

  return { reportError };
};

// HOC for class components
export const withComponentLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  options?: UseComponentLoadingOptions
) => {
  return function WithComponentLoading(props: P) {
    useComponentLoading(componentName, options);
    return <WrappedComponent {...props} />;
  };
};
