import { loadStripe } from '@stripe/stripe-js';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'sonner';
import { generateReceipt } from '../utils/receiptGenerator';
import type { Payment } from '../types/payment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createPaymentIntent(payment: Partial<Payment>) {
  try {
    // Create payment record in Firestore first
    const paymentRef = await addDoc(collection(db, 'payments'), {
      ...payment,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // Create Stripe Payment Intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: payment.amount,
        paymentId: paymentRef.id,
        metadata: {
          paymentId: paymentRef.id,
          propertyId: payment.propertyId,
          tenantId: payment.tenantId
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return { clientSecret, paymentId: paymentRef.id };
  } catch (error) {
    console.error('Error creating payment:', error);
    toast.error(error instanceof Error ? error.message : 'Payment creation failed');
    throw error;
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  error?: string
) {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    const update: any = {
      status,
      updatedAt: Date.now()
    };

    if (status === 'paid') {
      update.paidDate = Date.now();
      update.receiptUrl = await generateReceipt(paymentId);
    } else if (status === 'failed' && error) {
      update.error = error;
    }

    await updateDoc(paymentRef, update);

    if (status === 'paid') {
      toast.success('Payment successful! Generating receipt...');
    } else if (status === 'failed') {
      toast.error(`Payment failed: ${error}`);
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    toast.error('Failed to update payment status');
    throw error;
  }
}

export { stripePromise };