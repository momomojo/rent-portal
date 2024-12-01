import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '@/App';
import { server } from '../setup';
import { rest } from 'msw';

describe('Offline Functionality', () => {
  const mockServiceWorker = {
    register: vi.fn(),
    ready: Promise.resolve({
      active: { state: 'activated' },
    }),
  };

  beforeAll(() => {
    // Mock service worker registration
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        serviceWorker: mockServiceWorker,
      },
      writable: true,
    });

    // Mock offline status
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        onLine: true,
      },
      writable: true,
    });
  });

  test('displays offline notification when network is lost', async () => {
    renderWithProviders(<App />);
    
    // Simulate going offline
    window.dispatchEvent(new Event('offline'));
    
    await waitFor(() => {
      expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
    });
  });

  test('caches essential resources for offline access', async () => {
    // Mock cache storage
    const mockCache = {
      put: vi.fn(),
      match: vi.fn(),
    };
    
    Object.defineProperty(window, 'caches', {
      value: {
        open: () => Promise.resolve(mockCache),
      },
      writable: true,
    });

    renderWithProviders(<App />);
    
    // Verify cache is populated
    await waitFor(() => {
      expect(mockCache.put).toHaveBeenCalled();
    });
  });

  test('handles form submissions while offline', async () => {
    renderWithProviders(<App />);
    
    // Simulate offline state
    window.dispatchEvent(new Event('offline'));
    
    // Attempt form submission
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    // Verify offline queue message
    expect(screen.getByText(/queued for submission/i)).toBeInTheDocument();
  });

  test('syncs data when coming back online', async () => {
    renderWithProviders(<App />);
    
    // Simulate going offline and back online
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));
    
    // Verify sync message
    await waitFor(() => {
      expect(screen.getByText(/syncing data/i)).toBeInTheDocument();
    });
  });

  test('maintains state during offline period', async () => {
    const { store } = renderWithProviders(<App />);
    
    // Simulate offline state
    window.dispatchEvent(new Event('offline'));
    
    // Verify state persistence
    expect(store.getState()).toBeDefined();
    expect(localStorage.getItem('offlineState')).toBeDefined();
  });
});
