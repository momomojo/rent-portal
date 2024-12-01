import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

// Import markdown files
import privacyPolicy from '../../../docs/legal/privacy-policy.md?raw';
import accessibility from '../../../docs/legal/accessibility.md?raw';

const legalDocs = {
  'privacy-policy': {
    content: privacyPolicy,
    title: 'Privacy Policy',
  },
  accessibility: {
    content: accessibility,
    title: 'Accessibility Statement',
  },
};

export const LegalPage: React.FC = () => {
  const { docType } = useParams<{ docType: keyof typeof legalDocs }>();
  const { t } = useTranslation();

  const doc = docType ? legalDocs[docType] : null;

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('legal.title')}
          </h1>
          <nav className="space-y-4">
            {Object.entries(legalDocs).map(([key, { title }]) => (
              <Link
                key={key}
                to={`/legal/${key}`}
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-medium text-gray-900">{title}</h2>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/legal"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          ← {t('common.back')}
        </Link>
        <article className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow">
          <ReactMarkdown>{doc.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};
