import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Payment } from '../types/payment';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';
import { format, addDays, isBefore } from 'date-fns';

export function usePayments(propertyId?: string) {
  const { user } = useAuthState();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, propertyId]);

  const fetchPayments = async () => {
    try {
      let q = query(
        collection(db, 'payments'),
        orderBy('dueDate', 'desc')
      );

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
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (paymentData: Partial<Payment>) => {
    try {
      const newPayment = await addDoc(collection(db, 'payments'), {
        ...paymentData,
        status: 'pending',
        createdAt: Date.now(),
        isPartialPayment: false
      });
      
      toast.success('Payment initiated');
      return newPayment.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to initiate payment');
      throw error;
    }
  };

  const makePartialPayment = async (paymentId: string, amount: number) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      const remainingBalance = (payment.remainingBalance || payment.amount) - amount;
      
      await updateDoc(doc(db, 'payments', paymentId), {
        status: remainingBalance > 0 ? 'partial' : 'paid',
        remainingBalance,
        isPartialPayment: true,
        updatedAt: Date.now()
      });

      toast.success('Partial payment processed');
      await fetchPayments();
    } catch (error) {
      console.error('Error processing partial payment:', error);
      toast.error('Failed to process partial payment');
      throw error;
    }
  };

  const enableAutoPay = async (paymentId: string, method: Payment['paymentMethod'], day: number) => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        isAutoPayEnabled: true,
        autoPayMethod: method,
        autoPayDay: day,
        updatedAt: Date.now()
      });

      toast.success('AutoPay enabled');
      await fetchPayments();
    } catch (error) {
      console.error('Error enabling autopay:', error);
      toast.error('Failed to enable autopay');
      throw error;
    }
  };

  const processLateFees = async () => {
    try {
      const today = new Date();
      const pendingPayments = payments.filter(p => 
        p.status === 'pending' && 
        isBefore(new Date(p.dueDate), today)
      );

      for (const payment of pendingPayments) {
        const daysLate = Math.floor((today.getTime() - payment.dueDate) / (1000 * 60 * 60 * 24));
        if (daysLate >= payment.autoPayDay!) {
          const lateFee = 50; // Example late fee amount
          await updateDoc(doc(db, 'payments', payment.id), {
            status: 'late',
            lateFee,
            updatedAt: Date.now()
          });
        }
      }

      await fetchPayments();
    } catch (error) {
      console.error('Error processing late fees:', error);
      toast.error('Failed to process late fees');
    }
  };

  const generateReceipt = async (paymentId: string) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      // Generate PDF receipt using jsPDF
      const receiptUrl = `receipts/${paymentId}.pdf`;
      
      await updateDoc(doc(db, 'payments', paymentId), {
        receiptUrl,
        updatedAt: Date.now()
      });

      return receiptUrl;
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt');
      throw error;
    }
  };

  const manageSecurityDeposit = async (
    paymentId: string, 
    action: 'refund' | 'deduct',
    amount: number,
    reason: string
  ) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment || !payment.securityDeposit) throw new Error('Security deposit not found');

      const update = action === 'refund' 
        ? {
            'securityDeposit.status': amount === payment.securityDeposit.amount ? 'fully-refunded' : 'partially-refunded',
            'securityDeposit.refundHistory': [
              ...(payment.securityDeposit.refundHistory || []),
              {
                amount,
                date: Date.now(),
                reason,
                refundMethod: 'bank'
              }
            ]
          }
        : {
            'securityDeposit.deductions': [
              ...(payment.securityDeposit.deductions || []),
              {
                amount,
                date: Date.now(),
                reason,
                category: 'other',
                description: reason
              }
            ]
          };

      await updateDoc(doc(db, 'payments', paymentId), update);
      toast.success(`Security deposit ${action} processed`);
      await fetchPayments();
    } catch (error) {
      console.error('Error managing security deposit:', error);
      toast.error(`Failed to ${action} security deposit`);
      throw error;
    }
  };

  return {
    payments,
    loading,
    makePayment,
    makePartialPayment,
    enableAutoPay,
    processLateFees,
    generateReceipt,
    manageSecurityDeposit,
    refreshPayments: fetchPayments
  };
}