import { useState } from 'react';
import { SystemPreferences } from '../../types/settings';
import { Settings } from 'lucide-react';

interface SystemSettingsProps {
  settings: SystemPreferences;
  onUpdate: (settings: SystemPreferences) => void;
}

export default function SystemSettings({ settings, onUpdate }: SystemSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">System Preferences</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure general system settings and preferences.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Time Format
                </label>
                <select
                  value={formData.timeFormat}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeFormat: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="12">12-hour</option>
                  <option value="24">24-hour</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Default Payment Due Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.defaultPaymentDueDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultPaymentDueDay: Number(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Automatic Logout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  value={formData.automaticLogout}
                  onChange={(e) => setFormData(prev => ({ ...prev, automaticLogout: Number(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Maintenance Request Types
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {formData.maintenanceRequestTypes.map((type, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => {
                          const newTypes = [...formData.maintenanceRequestTypes];
                          newTypes[index] = e.target.value;
                          setFormData(prev => ({ ...prev, maintenanceRequestTypes: newTypes }));
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTypes = formData.maintenanceRequestTypes.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, maintenanceRequestTypes: newTypes }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        maintenanceRequestTypes: [...prev.maintenanceRequestTypes, '']
                      }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Type
                  </button>
                </div>
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Property Types
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {formData.propertyTypes.map((type, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => {
                          const newTypes = [...formData.propertyTypes];
                          newTypes[index] = e.target.value;
                          setFormData(prev => ({ ...prev, propertyTypes: newTypes }));
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTypes = formData.propertyTypes.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, propertyTypes: newTypes }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        propertyTypes: [...prev.propertyTypes, '']
                      }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Type
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}