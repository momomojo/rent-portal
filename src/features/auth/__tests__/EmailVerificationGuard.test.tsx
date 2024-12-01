import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailVerificationGuard } from '../components/EmailVerificationGuard';
import { useAuthState } from '@shared/hooks/useAuthState';
import { useEmailVerification } from '../hooks/useEmailVerification';

// Mock the hooks
jest.mock('@shared/hooks/useAuthState');
jest.mock('../hooks/useEmailVerification');

describe('EmailVerificationGuard', () => {
  const mockChildren = <div>Protected Content</div>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user is verified', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { emailVerified: true, email: 'test@example.com' }
    });

    render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Email Verification Required')).not.toBeInTheDocument();
  });

  it('should render verification notice when user is not verified', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { emailVerified: false, email: 'test@example.com' }
    });
    (useEmailVerification as jest.Mock).mockReturnValue({
      sending: false,
      error: null,
      sendVerificationEmail: jest.fn()
    });

    render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should handle resend verification email', async () => {
    const mockSendVerificationEmail = jest.fn();
    (useAuthState as jest.Mock).mockReturnValue({
      user: { emailVerified: false, email: 'test@example.com' }
    });
    (useEmailVerification as jest.Mock).mockReturnValue({
      sending: false,
      error: null,
      sendVerificationEmail: mockSendVerificationEmail
    });

    render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    const resendButton = screen.getByText('Resend Verification Email');
    fireEvent.click(resendButton);
    
    expect(mockSendVerificationEmail).toHaveBeenCalled();
  });

  it('should show loading state while sending verification email', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { emailVerified: false, email: 'test@example.com' }
    });
    (useEmailVerification as jest.Mock).mockReturnValue({
      sending: true,
      error: null,
      sendVerificationEmail: jest.fn()
    });

    render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByText('Sending...').closest('button')).toBeDisabled();
  });

  it('should display error message when verification email fails', () => {
    const errorMessage = 'Failed to send verification email';
    (useAuthState as jest.Mock).mockReturnValue({
      user: { emailVerified: false, email: 'test@example.com' }
    });
    (useEmailVerification as jest.Mock).mockReturnValue({
      sending: false,
      error: errorMessage,
      sendVerificationEmail: jest.fn()
    });

    render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should return null when no user is present', () => {
    (useAuthState as jest.Mock).mockReturnValue({ user: null });

    const { container } = render(<EmailVerificationGuard>{mockChildren}</EmailVerificationGuard>);
    
    expect(container).toBeEmptyDOMElement();
  });
});
