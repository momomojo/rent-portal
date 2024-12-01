import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { supportedLanguages, type LanguageCode } from '@core/i18n/config';

export const useLocale = () => {
  const { i18n } = useTranslation();

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language
  ) || supportedLanguages[0];

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = currentLanguage.code;

    // Update body class for RTL styling
    if (currentLanguage.dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage]);

  const changeLanguage = async (code: LanguageCode) => {
    await i18n.changeLanguage(code);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat(currentLanguage.code).format(
      typeof date === 'string' ? new Date(date) : date
    );
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(currentLanguage.code).format(number);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat(currentLanguage.code, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    isRTL: currentLanguage.dir === 'rtl',
  };
};

// Example usage:
/*
const Component = () => {
  const { t } = useTranslation();
  const { 
    currentLanguage,
    changeLanguage,
    formatCurrency,
    isRTL 
  } = useLocale();

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <select
        value={currentLanguage.code}
        onChange={(e) => changeLanguage(e.target.value as LanguageCode)}
      >
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <p>{t('welcome')}</p>
      <p>{formatCurrency(1000)}</p>
    </div>
  );
};
*/
