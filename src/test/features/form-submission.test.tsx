import { describe, test, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/test-utils';
import { LoginForm } from '@features/auth/components/LoginForm';
import { ContactForm } from '@features/contact/components/ContactForm';

describe('Form Submissions', () => {
  const user = userEvent.setup();

  describe('Login Form', () => {
    beforeEach(() => {
      renderWithProviders(<LoginForm />);
    });

    test('validates required fields', async () => {
      const submitButton = screen.getByRole('button', { name: /submit|login/i });
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    test('handles successful form submission', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      });
    });

    test('displays error message on invalid credentials', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit|login/i });

      await user.type(emailInput, 'invalid@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Contact Form', () => {
    beforeEach(() => {
      renderWithProviders(<ContactForm />);
    });

    test('validates email format', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send|submit/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    test('handles successful message submission', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send|submit/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    test('preserves form data on navigation', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Simulate navigation away and back
      const { unmount } = renderWithProviders(<ContactForm />);
      unmount();
      renderWithProviders(<ContactForm />);

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });
  });
});
