import { describe, test, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/test-utils';
import App from '@/App';

describe('Cookie Consent', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('displays cookie consent banner on first visit', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByRole('dialog', { name: /cookie consent/i })).toBeInTheDocument();
    expect(screen.getByText(/we use cookies/i)).toBeInTheDocument();
  });

  test('allows accepting all cookies', async () => {
    renderWithProviders(<App />);
    
    const acceptButton = screen.getByRole('button', { name: /accept all/i });
    await user.click(acceptButton);
    
    // Verify banner is dismissed
    expect(screen.queryByRole('dialog', { name: /cookie consent/i })).not.toBeInTheDocument();
    
    // Verify cookies are set
    expect(localStorage.getItem('cookieConsent')).toBe('all');
  });

  test('allows rejecting non-essential cookies', async () => {
    renderWithProviders(<App />);
    
    const rejectButton = screen.getByRole('button', { name: /reject all/i });
    await user.click(rejectButton);
    
    // Verify banner is dismissed
    expect(screen.queryByRole('dialog', { name: /cookie consent/i })).not.toBeInTheDocument();
    
    // Verify only essential cookies are accepted
    expect(localStorage.getItem('cookieConsent')).toBe('essential');
  });

  test('persists cookie preferences across sessions', async () => {
    // First visit - accept cookies
    const { unmount } = renderWithProviders(<App />);
    const acceptButton = screen.getByRole('button', { name: /accept all/i });
    await user.click(acceptButton);
    unmount();

    // Second visit - should not show banner
    renderWithProviders(<App />);
    expect(screen.queryByRole('dialog', { name: /cookie consent/i })).not.toBeInTheDocument();
  });

  test('allows managing cookie preferences through settings', async () => {
    renderWithProviders(<App />);
    
    // Accept cookies initially
    const acceptButton = screen.getByRole('button', { name: /accept all/i });
    await user.click(acceptButton);

    // Open cookie settings
    const settingsButton = screen.getByRole('button', { name: /cookie settings/i });
    await user.click(settingsButton);

    // Toggle analytics cookies off
    const analyticsToggle = screen.getByRole('switch', { name: /analytics cookies/i });
    await user.click(analyticsToggle);

    // Save preferences
    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    await user.click(saveButton);

    // Verify updated preferences
    expect(localStorage.getItem('cookieConsent')).toContain('analytics:false');
  });

  test('respects Do Not Track browser setting', () => {
    // Mock Do Not Track setting
    Object.defineProperty(window.navigator, 'doNotTrack', {
      value: '1',
      configurable: true
    });

    renderWithProviders(<App />);
    
    // Verify only essential cookies are enabled
    expect(localStorage.getItem('cookieConsent')).toBe('essential');
    expect(screen.queryByRole('dialog', { name: /cookie consent/i })).not.toBeInTheDocument();
  });
});
