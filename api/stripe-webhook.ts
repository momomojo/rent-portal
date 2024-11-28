import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { generateReceipt } from '../src/utils/receiptGenerator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || !endpointSecret) {
    return res.status(400).json({ error: 'Missing signature or endpoint secret' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const { paymentId } = paymentIntent.metadata;
  if (!paymentId) return;

  const paymentRef = doc(db, 'payments', paymentId);
  const paymentDoc = await getDoc(paymentRef);

  if (!paymentDoc.exists()) return;

  const payment = paymentDoc.data();
  const receiptUrl = await generateReceipt(payment);

  await updateDoc(paymentRef, {
    status: 'paid',
    paidDate: Date.now(),
    stripePaymentId: paymentIntent.id,
    receiptUrl,
    updatedAt: Date.now()
  });
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const { paymentId } = paymentIntent.metadata;
  if (!paymentId) return;

  await updateDoc(doc(db, 'payments', paymentId), {
    status: 'failed',
    error: paymentIntent.last_payment_error?.message || 'Payment failed',
    updatedAt: Date.now()
  });
}