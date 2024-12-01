import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/test-utils';
import { setupApiMocks, mockApiSuccess, mockApiError } from '../utils/api-mocks';
import AuthForm from '@features/auth/components/AuthForm';

describe('Authentication Integration Tests', () => {
  setupApiMocks();

  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Login Flow', () => {
    it('should successfully log in a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'tenant',
      };

      mockApiSuccess('post', '/auth/login', {
        token: 'mock-token',
        user: mockUser,
      });

      renderWithProviders(<AuthForm type="login" />);

      // Fill in the form
      await userEvent.type(
        screen.getByLabelText(/email/i),
        'test@example.com'
      );
      await userEvent.type(
        screen.getByLabelText(/password/i),
        'password123'
      );

      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      // Verify success state
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard');
      });
    });

    it('should display error message on login failure', async () => {
      mockApiError('post', '/auth/login', 401, 'Invalid credentials');

      renderWithProviders(<AuthForm type="login" />);

      // Fill in the form
      await userEvent.type(
        screen.getByLabelText(/email/i),
        'test@example.com'
      );
      await userEvent.type(
        screen.getByLabelText(/password/i),
        'wrongpassword'
      );

      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      // Verify error state
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        role: 'tenant',
      };

      mockApiSuccess('post', '/auth/register', {
        token: 'mock-token',
        user: mockUser,
      });

      renderWithProviders(<AuthForm type="register" />);

      // Fill in the form
      await userEvent.type(
        screen.getByLabelText(/email/i),
        'newuser@example.com'
      );
      await userEvent.type(
        screen.getByLabelText(/password/i),
        'password123'
      );
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        'password123'
      );

      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      // Verify success state
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard');
      });
    });

    it('should validate password confirmation', async () => {
      renderWithProviders(<AuthForm type="register" />);

      // Fill in the form with mismatched passwords
      await userEvent.type(
        screen.getByLabelText(/email/i),
        'newuser@example.com'
      );
      await userEvent.type(
        screen.getByLabelText(/password/i),
        'password123'
      );
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        'differentpassword'
      );

      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      // Verify error state
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  describe('Password Reset Flow', () => {
    it('should send password reset email', async () => {
      mockApiSuccess('post', '/auth/reset-password', {
        message: 'Password reset email sent',
      });

      renderWithProviders(<AuthForm type="login" />);

      // Click forgot password link
      await userEvent.click(screen.getByText(/forgot password/i));

      // Fill in email
      await userEvent.type(
        screen.getByLabelText(/email/i),
        'test@example.com'
      );

      // Submit the form
      await userEvent.click(
        screen.getByRole('button', { name: /reset password/i })
      );

      // Verify success state
      await waitFor(() => {
        expect(
          screen.getByText(/password reset email sent/i)
        ).toBeInTheDocument();
      });
    });
  });
});
