import React, { PropsWithChildren } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@core/store/rootReducer';
import { ThemeProvider } from '@core/context/ThemeContext';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RootState } from '@core/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>{children}</ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Mock Intersection Observer
export function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  unobserve = () => null,
  takeRecords = () => [],
} = {}): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = root;
    readonly rootMargin: string = rootMargin;
    readonly thresholds: ReadonlyArray<number> = thresholds;
    disconnect: () => void = disconnect;
    observe: (target: Element) => void = observe;
    unobserve: (target: Element) => void = unobserve;
    takeRecords: () => IntersectionObserverEntry[] = takeRecords;
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

// Mock ResizeObserver
export function setupResizeObserverMock(): void {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = MockResizeObserver;
}

// Mock matchMedia
export function setupMatchMediaMock(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Setup all mocks
export function setupTestEnv(): void {
  setupIntersectionObserverMock();
  setupResizeObserverMock();
  setupMatchMediaMock();
}
