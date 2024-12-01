import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { downloadUserData, deleteUserData } from '../compliance/DataExport';

export const DataPrivacySettings: React.FC = () => {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    setLoading(true);
    try {
      await downloadUserData();
      toast.success(t('privacy.export.success'));
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(t('privacy.export.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const success = await deleteUserData();
      if (success) {
        toast.success(t('privacy.delete.success'));
        // Redirect to home page or login page
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(t('privacy.delete.error'));
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {t('privacy.settings.title')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('privacy.settings.description')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <button
            onClick={handleExportData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-5 w-5 mr-2" aria-hidden="true" />
            {t('privacy.export.button')}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            {t('privacy.export.description')}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-5 w-5 mr-2" aria-hidden="true" />
            {t('privacy.delete.button')}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            {t('privacy.delete.description')}
          </p>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {t('privacy.delete.confirm.title')}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t('privacy.delete.confirm.description')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? t('common.loading') : t('privacy.delete.confirm.button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPrivacySettings;
