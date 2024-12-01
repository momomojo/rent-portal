import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { ErrorBoundary } from 'react-error-boundary';

describe('Error Handling', () => {
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  afterEach(() => {
    mockConsoleError.mockReset();
  });

  it('catches and handles runtime errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    // Trigger an API call
    fireEvent.click(screen.getByText('Load Data'));
    
    // Verify error message is displayed
    expect(await screen.findByText('Failed to load data')).toBeInTheDocument();
    
    mockFetch.mockRestore();
  });

  it('handles network connectivity issues', async () => {
    const mockOnline = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    
    render(<App />);
    
    expect(screen.getByText('No internet connection')).toBeInTheDocument();
    
    mockOnline.mockRestore();
  });

  it('handles form validation errors', () => {
    render(<App />);
    
    // Submit form with invalid data
    fireEvent.click(screen.getByText('Submit'));
    
    // Verify validation error messages
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('handles authentication errors', async () => {
    const mockAuth = vi.fn().mockRejectedValue(new Error('Authentication failed'));
    
    render(<App />);
    
    fireEvent.click(screen.getByText('Login'));
    
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('provides user-friendly error messages', () => {
    const technicalError = new Error('ECONNREFUSED');
    const friendlyMessage = 'Unable to connect to the server. Please try again later.';
    
    render(<App />);
    
    // Simulate error
    fireEvent.click(screen.getByText('Trigger Error'));
    
    expect(screen.getByText(friendlyMessage)).toBeInTheDocument();
    expect(screen.queryByText(technicalError.message)).not.toBeInTheDocument();
  });
});
