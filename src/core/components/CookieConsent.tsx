import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShow(false);
    
    // Trigger relevant tracking based on preferences
    if (prefs.analytics) {
      // Initialize analytics
      console.log('Analytics initialized');
    }
    if (prefs.marketing) {
      // Initialize marketing tools
      console.log('Marketing tools initialized');
    }
  };

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 md:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-7xl mx-auto">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 id="cookie-consent-title" className="text-lg font-medium mb-2">
                {t('cookies.title')}
              </h2>
              <p id="cookie-consent-description" className="text-sm text-gray-600">
                {t('cookies.message')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowPreferences(true)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label={t('cookies.preferences')}
              >
                {t('cookies.preferences')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-label={t('cookies.acceptAll')}
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4" role="dialog" aria-labelledby="cookie-preferences-title">
            <div className="flex items-center justify-between">
              <h3 id="cookie-preferences-title" className="text-lg font-medium">
                {t('cookies.preferencesTitle')}
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label={t('cookies.close')}
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('cookies.necessary')}</p>
                  <p className="text-sm text-gray-500">
                    {t('cookies.necessaryDescription')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="h-4 w-4 text-primary-600 cursor-not-allowed"
                  aria-label={t('cookies.necessary')}
                  aria-describedby="necessary-description"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('cookies.analytics')}</p>
                  <p id="analytics-description" className="text-sm text-gray-500">
                    {t('cookies.analyticsDescription')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 cursor-pointer"
                  aria-label={t('cookies.analytics')}
                  aria-describedby="analytics-description"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('cookies.marketing')}</p>
                  <p id="marketing-description" className="text-sm text-gray-500">
                    {t('cookies.marketingDescription')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 cursor-pointer"
                  aria-label={t('cookies.marketing')}
                  aria-describedby="marketing-description"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('cookies.preferences')}</p>
                  <p id="preferences-description" className="text-sm text-gray-500">
                    {t('cookies.preferencesDescription')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) =>
                    setPreferences({ ...preferences, preferences: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 cursor-pointer"
                  aria-label={t('cookies.preferences')}
                  aria-describedby="preferences-description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label={t('cookies.cancel')}
              >
                {t('cookies.cancel')}
              </button>
              <button
                onClick={handleAcceptSelected}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-label={t('cookies.savePreferences')}
              >
                {t('cookies.savePreferences')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
