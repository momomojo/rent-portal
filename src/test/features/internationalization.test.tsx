import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import App from '../../App';

describe('Internationalization', () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
  });

  it('loads default language (English) correctly', () => {
    expect(i18n.language).toBe('en');
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('changes language successfully', async () => {
    await i18n.changeLanguage('es');
    expect(i18n.language).toBe('es');
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  it('persists language preference', () => {
    i18n.changeLanguage('es');
    expect(localStorage.getItem('i18nextLng')).toBe('es');
  });

  it('formats dates and numbers according to locale', () => {
    const date = new Date('2024-03-01');
    const number = 1234.56;

    // Test English formatting
    i18n.changeLanguage('en');
    expect(new Intl.DateTimeFormat('en').format(date)).toBe('3/1/2024');
    expect(new Intl.NumberFormat('en').format(number)).toBe('1,234.56');

    // Test Spanish formatting
    i18n.changeLanguage('es');
    expect(new Intl.DateTimeFormat('es').format(date)).toBe('1/3/2024');
    expect(new Intl.NumberFormat('es').format(number)).toBe('1.234,56');
  });
});
