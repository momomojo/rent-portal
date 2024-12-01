import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { mockFirebase } from './mocks/firebase';
import { logger } from '@core/utils/logger';
import * as Sentry from '@sentry/react';

// Mock Firebase
mockFirebase();

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(() => ({
      create: vi.fn(),
      getElement: vi.fn(),
    })),
    confirmCardPayment: vi.fn(),
  })),
}));

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
}));

// Mock Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  startTransaction: vi.fn(() => ({
    finish: vi.fn(),
  })),
  getCurrentHub: vi.fn(() => ({
    getClient: vi.fn(() => ({
      getOptions: vi.fn(() => ({
        dsn: 'test-dsn',
      })),
    })),
  })),
}));

// Mock logger
vi.mock('@core/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    setUser: vi.fn(),
    clearUser: vi.fn(),
    setContext: vi.fn(),
    setTag: vi.fn(),
  },
}));

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Setup MSW server
export const server = setupServer(...handlers);

// Global test setup
beforeAll(() => {
  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' });
  
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;

  // Mock ResizeObserver
  window.ResizeObserver = MockResizeObserver;

  // Mock window.scrollTo
  window.scrollTo = vi.fn();

  // Mock console methods
  console.error = vi.fn();
  console.warn = vi.fn();
  console.log = vi.fn();

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock performance API
  window.performance.mark = vi.fn();
  window.performance.measure = vi.fn();
});

afterEach(() => {
  // Cleanup DOM
  cleanup();
  
  // Reset MSW handlers
  server.resetHandlers();
  
  // Clear all mocks
  vi.clearAllMocks();
  
  // Clear localStorage
  window.localStorage.clear();
  
  // Reset console mocks
  (console.error as any).mockClear();
  (console.warn as any).mockClear();
  (console.log as any).mockClear();
  
  // Reset Sentry mocks
  (Sentry.captureException as any).mockClear();
  (Sentry.captureMessage as any).mockClear();
  
  // Reset logger mocks
  (logger.error as any).mockClear();
  (logger.warn as any).mockClear();
  (logger.info as any).mockClear();
  (logger.debug as any).mockClear();
});

afterAll(() => {
  // Close MSW server
  server.close();
});