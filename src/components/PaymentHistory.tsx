import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Payment } from '../types/payment';

interface PaymentHistoryProps {
  tenantId?: string;
  propertyId?: string;
}

export default function PaymentHistory({ tenantId, propertyId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let q = query(collection(db, 'payments'), orderBy('dueDate', 'desc'));
        
        if (tenantId) {
          q = query(q, where('tenantId', '==', tenantId));
        }
        if (propertyId) {
          q = query(q, where('propertyId', '==', propertyId));
        }

        const snapshot = await getDocs(q);
        const paymentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        
        setPayments(paymentData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [tenantId, propertyId]);

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {format(payment.dueDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {payment.paidDate && (
                    <span className="text-sm text-gray-500 mr-4">
                      Paid: {format(payment.paidDate, 'MMM dd, yyyy')}
                    </span>
                  )}
                  {getStatusIcon(payment.status)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}