/**
 * Material-UI Component Optimizer
 * 
 * This utility provides:
 * 1. Selective component importing
 * 2. Performance monitoring for MUI components
 * 3. Bundle size optimization
 */

import { ComponentType } from 'react';
import { trackComponentLoad } from '../monitoring/metrics';

// Track which components have been loaded
const loadedComponents = new Set<string>();

// Cache for component imports
const importCache: Record<string, Promise<any>> = {};

/**
 * Selectively import MUI components with performance tracking
 */
export const importMuiComponent = async <T extends ComponentType<any>>(
  componentName: string
): Promise<T> => {
  const startTime = performance.now();

  try {
    if (!importCache[componentName]) {
      importCache[componentName] = import(
        /* webpackChunkName: "[request]" */
        `@mui/material/${componentName}`
      );
    }

    const component = await importCache[componentName];
    
    if (!loadedComponents.has(componentName)) {
      const loadTime = performance.now() - startTime;
      trackComponentLoad(`MUI-${componentName}`, loadTime);
      loadedComponents.add(componentName);
    }

    return component.default;
  } catch (error) {
    console.error(`Failed to load MUI component ${componentName}:`, error);
    throw error;
  }
};

/**
 * Preload commonly used MUI components
 */
export const preloadCriticalMuiComponents = () => {
  if (typeof window === 'undefined') return;

  // List of critical components to preload
  const criticalComponents = [
    'Button',
    'TextField',
    'Dialog',
    'CircularProgress'
  ];

  requestIdleCallback(() => {
    criticalComponents.forEach(component => {
      importMuiComponent(component).catch(() => {
        // Silently fail preloading
      });
    });
  });
};

/**
 * HOC to wrap MUI components with performance monitoring
 */
export const withMuiPerformance = <P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) => {
  return function WithMuiPerformance(props: P) {
    const startTime = performance.now();

    // Track initial render
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTime;
      trackComponentLoad(`MUI-${componentName}-render`, renderTime);
    });

    return <WrappedComponent {...props} />;
  };
};
