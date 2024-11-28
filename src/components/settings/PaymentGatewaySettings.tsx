import { useState } from 'react';
import { PaymentSettings } from '../../types/settings';
import { CreditCard, Key, Lock } from 'lucide-react';

interface PaymentGatewaySettingsProps {
  settings: PaymentSettings;
  onUpdate: (settings: PaymentSettings) => void;
}

export default function PaymentGatewaySettings({ settings, onUpdate }: PaymentGatewaySettingsProps) {
  const [formData, setFormData] = useState(settings);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment Gateway</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure your Stripe payment gateway settings
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stripe Publishable Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.stripePublishableKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  stripePublishableKey: e.target.value
                }))}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="pk_test_..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stripe Secret Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showSecretKey ? 'text' : 'password'}
                value={formData.stripeSecretKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  stripeSecretKey: e.target.value
                }))}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="sk_test_..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showSecretKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Note
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Make sure to use test keys in development and production keys in live environment.
                    Never expose your secret key in client-side code.
                  </p>
                </div>
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