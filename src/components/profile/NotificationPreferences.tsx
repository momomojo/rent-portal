import { useState } from 'react';
import { Bell, Mail, Phone } from 'lucide-react';
import { NotificationPreferences as NotificationPreferencesType } from '../../types/notification';

interface NotificationPreferencesProps {
  preferences: NotificationPreferencesType;
  onUpdate: (preferences: NotificationPreferencesType) => void;
}

export default function NotificationPreferences({ preferences, onUpdate }: NotificationPreferencesProps) {
  const [formData, setFormData] = useState(preferences);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose how you want to receive notifications
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email"
                type="checkbox"
                checked={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="email" className="font-medium text-gray-700 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="push"
                type="checkbox"
                checked={formData.push}
                onChange={(e) => setFormData(prev => ({ ...prev, push: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="push" className="font-medium text-gray-700 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Push Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications in your browser
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="sms"
                type="checkbox"
                checked={formData.sms}
                onChange={(e) => setFormData(prev => ({ ...prev, sms: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="sms" className="font-medium text-gray-700 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                SMS Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications via text message
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}