import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CookieConsent } from '@/core/components/CookieConsent';
import { LegalPage } from '@/pages/legal/LegalPage';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/core/i18n/config';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Compliance Features', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Cookie Consent', () => {
    it('should show cookie consent banner when no preferences are set', () => {
      renderWithProviders(<CookieConsent />);
      expect(screen.getByText(/cookies.message/i)).toBeInTheDocument();
    });

    it('should not show banner when preferences are already set', () => {
      localStorage.setItem('cookieConsent', JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      }));
      renderWithProviders(<CookieConsent />);
      expect(screen.queryByText(/cookies.message/i)).not.toBeInTheDocument();
    });

    it('should save preferences when accepting selected options', async () => {
      renderWithProviders(<CookieConsent />);
      
      // Open preferences
      fireEvent.click(screen.getByText(/cookies.preferences/i));
      
      // Toggle analytics
      const analyticsCheckbox = screen.getByRole('checkbox', { name: /cookies.analytics/i });
      fireEvent.click(analyticsCheckbox);
      
      // Save preferences
      fireEvent.click(screen.getByText(/cookies.savePreferences/i));
      
      await waitFor(() => {
        const savedPreferences = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
        expect(savedPreferences.analytics).toBe(true);
      });
    });
  });

  describe('Legal Pages', () => {
    it('should render privacy policy content', () => {
      renderWithProviders(<LegalPage />);
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });

    it('should render accessibility statement content', () => {
      renderWithProviders(<LegalPage />);
      expect(screen.getByText(/Accessibility Statement/i)).toBeInTheDocument();
    });

    it('should navigate between legal documents', async () => {
      renderWithProviders(<LegalPage />);
      
      // Click privacy policy link
      fireEvent.click(screen.getByText(/Privacy Policy/i));
      await waitFor(() => {
        expect(screen.getByRole('article')).toBeInTheDocument();
      });
      
      // Go back
      fireEvent.click(screen.getByText(/← common.back/i));
      await waitFor(() => {
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      });
    });
  });
});
