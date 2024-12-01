import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('privacy.title')}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataCollection.title')}</h2>
        <p className="mb-4">{t('privacy.dataCollection.description')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('privacy.dataCollection.items.personal')}</li>
          <li>{t('privacy.dataCollection.items.usage')}</li>
          <li>{t('privacy.dataCollection.items.technical')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataPurpose.title')}</h2>
        <p className="mb-4">{t('privacy.dataPurpose.description')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('privacy.dataPurpose.items.service')}</li>
          <li>{t('privacy.dataPurpose.items.improvement')}</li>
          <li>{t('privacy.dataPurpose.items.communication')}</li>
          <li>{t('privacy.dataPurpose.items.legal')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataRights.title')}</h2>
        <p className="mb-4">{t('privacy.dataRights.description')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('privacy.dataRights.items.access')}</li>
          <li>{t('privacy.dataRights.items.rectification')}</li>
          <li>{t('privacy.dataRights.items.erasure')}</li>
          <li>{t('privacy.dataRights.items.portability')}</li>
          <li>{t('privacy.dataRights.items.withdraw')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies.title')}</h2>
        <p className="mb-4">{t('privacy.cookies.description')}</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{t('privacy.cookies.types.necessary.title')}</h3>
          <p className="mb-4">{t('privacy.cookies.types.necessary.description')}</p>

          <h3 className="font-semibold mb-2">{t('privacy.cookies.types.analytics.title')}</h3>
          <p className="mb-4">{t('privacy.cookies.types.analytics.description')}</p>

          <h3 className="font-semibold mb-2">{t('privacy.cookies.types.marketing.title')}</h3>
          <p className="mb-4">{t('privacy.cookies.types.marketing.description')}</p>

          <h3 className="font-semibold mb-2">{t('privacy.cookies.types.preferences.title')}</h3>
          <p>{t('privacy.cookies.types.preferences.description')}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataRetention.title')}</h2>
        <p className="mb-4">{t('privacy.dataRetention.description')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('privacy.dataRetention.items.account')}</li>
          <li>{t('privacy.dataRetention.items.legal')}</li>
          <li>{t('privacy.dataRetention.items.backup')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataSecurity.title')}</h2>
        <p className="mb-4">{t('privacy.dataSecurity.description')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('privacy.dataSecurity.items.encryption')}</li>
          <li>{t('privacy.dataSecurity.items.access')}</li>
          <li>{t('privacy.dataSecurity.items.monitoring')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
        <p className="mb-4">{t('privacy.contact.description')}</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{t('privacy.contact.email.label')}</p>
          <p className="mb-2">{t('privacy.contact.email.value')}</p>
          <p className="font-semibold">{t('privacy.contact.address.label')}</p>
          <p>{t('privacy.contact.address.value')}</p>
        </div>
      </section>

      <footer className="text-sm text-gray-500">
        <p>{t('privacy.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
