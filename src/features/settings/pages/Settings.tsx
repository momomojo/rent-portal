import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/user';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: {
    payments: boolean;
    maintenance: boolean;
    documents: boolean;
    messages: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginHistory: {
    date: string;
    device: string;
    location: string;
  }[];
}

const Settings: React.FC = () => {
  const { user } = useAuthState();
  const [activeTab, setActiveTab] = useState('notifications');
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    types: {
      payments: true,
      maintenance: true,
      documents: true,
      messages: true,
    },
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-01',
    loginHistory: [],
  });

  const handleNotificationChange = (
    channel: keyof NotificationSettings,
    value: boolean
  ) => {
    if (channel === 'email' || channel === 'sms' || channel === 'push') {
      setNotificationSettings((prev) => ({
        ...prev,
        [channel]: value,
      }));
    }
  };

  const handleNotificationTypeChange = (
    type: keyof NotificationSettings['types'],
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: value,
      },
    }));
  };

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Notification Channels
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="email-notifications"
                className="font-medium text-gray-700"
              >
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleNotificationChange('email', !notificationSettings.email)
              }
              className={`${
                notificationSettings.email
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  notificationSettings.email ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="sms-notifications"
                className="font-medium text-gray-700"
              >
                SMS Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive notifications via SMS
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleNotificationChange('sms', !notificationSettings.sms)
              }
              className={`${
                notificationSettings.sms
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  notificationSettings.sms ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="push-notifications"
                className="font-medium text-gray-700"
              >
                Push Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive push notifications
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleNotificationChange('push', !notificationSettings.push)
              }
              className={`${
                notificationSettings.push
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  notificationSettings.push ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Types
        </h3>
        <div className="mt-4 space-y-4">
          {Object.entries(notificationSettings.types).map(([type, enabled]) => (
            <div key={type} className="flex items-center justify-between">
              <div>
                <label
                  htmlFor={`${type}-notifications`}
                  className="font-medium text-gray-700"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
                <p className="text-sm text-gray-500">
                  Receive notifications about {type}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleNotificationTypeChange(
                    type as keyof NotificationSettings['types'],
                    !enabled
                  )
                }
                className={`${
                  enabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Two-Factor Authentication
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
            <p className="text-sm text-gray-500">
              Status:{' '}
              <span
                className={`font-medium ${
                  securitySettings.twoFactorEnabled
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">Password</h3>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Last changed: {securitySettings.lastPasswordChange}
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">Login History</h3>
        <div className="mt-4">
          {securitySettings.loginHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No recent login activity</p>
          ) : (
            <div className="space-y-4">
              {securitySettings.loginHistory.map((login, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{login.device}</p>
                    <p className="text-gray-500">{login.location}</p>
                  </div>
                  <p className="text-gray-500">{login.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        <div className="mt-6">
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="notifications">Notifications</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`${
                  activeTab === 'notifications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`${
                  activeTab === 'security'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="p-4 sm:p-6">
              {activeTab === 'notifications'
                ? renderNotificationSettings()
                : renderSecuritySettings()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
