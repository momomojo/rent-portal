import { useState } from 'react';
import { PaymentSettings } from '../../types/settings';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';

interface PaymentMethodSettingsProps {
  settings: PaymentSettings;
  onUpdate: (settings: PaymentSettings) => void;
}

export default function PaymentMethodSettings({ settings, onUpdate }: PaymentMethodSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure accepted payment methods and settings
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Accepted Payment Methods</label>
            <div className="mt-2 space-y-2">
              {Object.entries(formData.paymentMethods).map(([method, enabled]) => (
                <div key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      paymentMethods: {
                        ...prev.paymentMethods,
                        [method]: e.target.checked
                      }
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900 capitalize">
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Automatic Payments</label>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enableAutomaticPayments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    enableAutomaticPayments: e.target.checked
                  }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable automatic payments
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Late Fee Settings</label>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-700">Default Late Fee Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.defaultLateFeeAmount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultLateFeeAmount: Number(e.target.value)
                    }))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Late Fee Start Day</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.defaultLateFeeStartDay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      defaultLateFeeStartDay: Number(e.target.value)
                    }))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Partial Payments</label>
            <div className="mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowPartialPayments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    allowPartialPayments: e.target.checked
                  }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Allow partial payments
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}