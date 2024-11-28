import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, updatePaymentStatus } from '../lib/stripe';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Building, Calendar } from 'lucide-react';
import { usePayments } from '../hooks/usePayments';
import type { Payment } from '../types/payment';

interface PaymentFormProps {
  amount: number;
  propertyId: string;
  tenantId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  allowPartial?: boolean;
  isSecurityDeposit?: boolean;
}

export default function PaymentForm({
  amount,
  propertyId,
  tenantId,
  onSuccess,
  onCancel,
  allowPartial = false,
  isSecurityDeposit = false
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { makePayment, makePartialPayment } = usePayments(propertyId);
  
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Payment['paymentMethod']>('card');
  const [partialAmount, setPartialAmount] = useState(amount);
  const [enableAutoPay, setEnableAutoPay] = useState(false);
  const [autoPayDay, setAutoPayDay] = useState(1);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const paymentData: Partial<Payment> = {
        amount: partialAmount,
        propertyId,
        tenantId,
        type: isSecurityDeposit ? 'deposit' : 'rent',
        dueDate: Date.now(),
        paymentMethod,
        isPartialPayment: partialAmount < amount,
        remainingBalance: partialAmount < amount ? amount - partialAmount : 0,
        isAutoPayEnabled: enableAutoPay,
        autoPayMethod: enableAutoPay ? paymentMethod : undefined,
        autoPayDay: enableAutoPay ? autoPayDay : undefined
      };

      if (isSecurityDeposit) {
        paymentData.securityDeposit = {
          amount: partialAmount,
          status: 'held'
        };
      }

      const paymentId = await makePayment(paymentData);

      if (paymentMethod === 'card') {
        const { clientSecret } = await createPaymentIntent({
          amount: partialAmount,
          propertyId,
          tenantId,
          type: isSecurityDeposit ? 'deposit' : 'rent',
          dueDate: Date.now()
        });

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (error) {
          toast.error(error.message);
          await updatePaymentStatus(paymentId, 'failed');
        } else if (paymentIntent.status === 'succeeded') {
          await updatePaymentStatus(paymentId, partialAmount < amount ? 'partial' : 'paid');
          toast.success('Payment successful!');
          onSuccess?.();
        }
      } else if (paymentMethod === 'bank') {
        // Handle ACH payment logic here
        toast.success('Bank payment initiated. Please complete the process in your banking app.');
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
          <div className="flex items-center text-green-600">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-xl font-semibold">${amount}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center px-4 py-3 border rounded-md ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`flex items-center justify-center px-4 py-3 border rounded-md ${
                  paymentMethod === 'bank'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <Building className="h-5 w-5 mr-2" />
                Bank Transfer
              </button>
            </div>
          </div>

          {allowPartial && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  max={amount}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(Number(e.target.value))}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="relative">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
                className="p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          )}

          {!isSecurityDeposit && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={enableAutoPay}
                onChange={(e) => setEnableAutoPay(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable AutoPay for future payments
              </label>
            </div>
          )}

          {enableAutoPay && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                AutoPay Day of Month
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={autoPayDay}
                  onChange={(e) => setAutoPayDay(Number(e.target.value))}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {processing ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}