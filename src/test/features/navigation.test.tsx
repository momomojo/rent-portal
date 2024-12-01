import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { renderWithProviders } from '../utils/test-utils';
import { mockAuthenticatedState, mockAdminState } from '../mocks/state';

describe('Navigation and Routing', () => {
  describe('Authenticated User Navigation', () => {
    beforeEach(() => {
      renderWithProviders(<App />, {
        preloadedState: mockAuthenticatedState
      });
    });

    it('navigates to main pages correctly', async () => {
      // Test navigation to main pages
      const links = [
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Properties', path: '/properties' },
        { text: 'Payments', path: '/payments' },
        { text: 'Documents', path: '/documents' }
      ];

      for (const link of links) {
        const linkElement = screen.getByText(link.text);
        fireEvent.click(linkElement);
        expect(window.location.pathname).toBe(link.path);
      }
    });

    it('maintains navigation history', () => {
      // Test browser history
      const pages = ['/dashboard', '/properties', '/payments'];
      
      pages.forEach(page => {
        window.history.pushState({}, '', page);
      });

      window.history.back();
      expect(window.location.pathname).toBe('/properties');
      
      window.history.back();
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  describe('Protected Routes', () => {
    it('redirects from admin routes when not admin', () => {
      renderWithProviders(<App />, {
        preloadedState: mockAuthenticatedState
      });

      // Try to access admin route
      const adminRoute = '/admin/dashboard';
      window.history.pushState({}, '', adminRoute);
      
      // Should redirect to dashboard if not admin
      expect(window.location.pathname).not.toBe(adminRoute);
    });

    it('allows admin access to admin routes', () => {
      renderWithProviders(<App />, {
        preloadedState: mockAdminState
      });

      // Try to access admin route
      const adminRoute = '/admin/dashboard';
      window.history.pushState({}, '', adminRoute);
      
      // Should stay on admin route
      expect(window.location.pathname).toBe(adminRoute);
    });
  });
});
