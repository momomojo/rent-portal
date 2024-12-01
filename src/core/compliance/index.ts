export { CookieConsent } from '../components/CookieConsent';
export { PrivacyPolicy } from '../components/PrivacyPolicy';
export { DataPrivacySettings } from '../components/DataPrivacySettings';
export { exportUserData, downloadUserData, deleteUserData } from './DataExport';

export const setupCompliance = () => {
  // Initialize cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent) {
    const preferences = JSON.parse(cookieConsent);
    if (preferences.analytics) {
      // Initialize analytics (placeholder for actual implementation)
      console.log('Analytics initialized');
    }
    if (preferences.marketing) {
      // Initialize marketing tools (placeholder for actual implementation)
      console.log('Marketing tools initialized');
    }
  }
};

export const isAnalyticsEnabled = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent) return false;
  return JSON.parse(cookieConsent).analytics;
};

export const isMarketingEnabled = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent) return false;
  return JSON.parse(cookieConsent).marketing;
};
