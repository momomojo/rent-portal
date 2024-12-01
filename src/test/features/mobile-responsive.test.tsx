import { describe, test, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '@/App';

describe('Mobile Responsiveness', () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    // Reset matchMedia for each test
    mockMatchMedia(false);
  });

  test('renders mobile navigation menu on small screens', () => {
    mockMatchMedia(true); // Simulate mobile viewport
    renderWithProviders(<App />);
    
    // Verify mobile menu elements are present
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  test('renders desktop navigation on large screens', () => {
    mockMatchMedia(false); // Simulate desktop viewport
    renderWithProviders(<App />);
    
    // Verify desktop navigation elements are present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
  });

  test('adjusts layout for different screen sizes', () => {
    mockMatchMedia(true); // Simulate mobile viewport
    const { container } = renderWithProviders(<App />);
    
    // Check if main content container has mobile-specific classes
    const mainContent = container.querySelector('main');
    expect(mainContent).toHaveClass('mobile-layout');
  });

  test('handles touch interactions on mobile devices', async () => {
    mockMatchMedia(true); // Simulate mobile viewport
    const { user } = renderWithProviders(<App />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    // Verify mobile menu opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
