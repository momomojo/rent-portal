import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import PaymentForm from '../components/PaymentForm';
import PaymentHistory from '../components/PaymentHistory';
import { useAuthState } from '../hooks/useAuthState';
import { Property } from '../types/property';
import { CreditCard, History } from 'lucide-react';

export default function Payments() {
  const { user } = useAuthState();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your rent payments and view payment history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowPaymentForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Current Balance
              </h3>
              <div className="mt-5">
                <div className="rounded-md bg-gray-50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Total Due</div>
                    <div className="text-2xl font-semibold text-indigo-600">$1,200.00</div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Due by March 1, 2024</div>
                </div>
              </div>
            </div>
          </div>

          {showPaymentForm && (
            <div className="mt-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={1200}
                  propertyId="property-id"
                  tenantId={user?.uid || ''}
                  onSuccess={() => setShowPaymentForm(false)}
                  onCancel={() => setShowPaymentForm(false)}
                />
              </Elements>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Payment History
                </h3>
                <History className="h-5 w-5 text-gray-400" />
              </div>
              <PaymentHistory tenantId={user?.uid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}