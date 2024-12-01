import React from 'react';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should show weak strength for simple passwords', () => {
    render(<PasswordStrengthIndicator password="simple123" />);
    
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
    expect(screen.getByText(/must contain at least one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/must contain at least one special character/i)).toBeInTheDocument();
  });

  it('should show medium strength for moderately complex passwords', () => {
    render(<PasswordStrengthIndicator password="Simple123!" />);
    
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('should show strong strength for complex passwords', () => {
    render(<PasswordStrengthIndicator password="SuperStrong123!@#" />);
    
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('should show all requirements for empty password', () => {
    render(<PasswordStrengthIndicator password="" />);
    
    const requirements = [
      /must be at least 8 characters/i,
      /must contain at least one uppercase letter/i,
      /must contain at least one lowercase letter/i,
      /must contain at least one number/i,
      /must contain at least one special character/i
    ];

    requirements.forEach(requirement => {
      expect(screen.getByText(requirement)).toBeInTheDocument();
    });
  });

  it('should update strength indicator as password changes', () => {
    const { rerender } = render(<PasswordStrengthIndicator password="weak" />);
    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    rerender(<PasswordStrengthIndicator password="Stronger123!" />);
    expect(screen.getByText(/medium/i)).toBeInTheDocument();

    rerender(<PasswordStrengthIndicator password="SuperStrong123!@#" />);
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
