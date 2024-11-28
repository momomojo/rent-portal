import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../AuthForm';
import { renderWithProviders } from '../../test/utils';

describe('AuthForm', () => {
  it('renders login form correctly', () => {
    renderWithProviders(<AuthForm type="login" />);
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders registration form correctly', () => {
    renderWithProviders(<AuthForm type="register" />);
    
    expect(screen.getByText('Create a new account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('handles login submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthForm type="login" />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/logged in successfully/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthForm type="login" />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });
});