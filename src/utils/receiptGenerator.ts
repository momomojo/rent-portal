import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import type { Payment } from '../types/payment';

export async function generateReceipt(payment: Payment): Promise<string> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Add header
  doc.setFontSize(20);
  doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // Add receipt details
  doc.setFontSize(12);
  doc.text(`Receipt Number: ${payment.id}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${format(payment.paidDate || Date.now(), 'MMM d, yyyy')}`, 20, yPos);
  yPos += 10;
  doc.text(`Payment Method: ${payment.paymentMethod}`, 20, yPos);
  yPos += 20;

  // Add payment details
  doc.text('Payment Details:', 20, yPos);
  yPos += 10;
  doc.text(`Amount Paid: $${payment.amount.toFixed(2)}`, 30, yPos);
  yPos += 10;
  if (payment.lateFee) {
    doc.text(`Late Fee: $${payment.lateFee.toFixed(2)}`, 30, yPos);
    yPos += 10;
  }
  doc.text(`Total: $${(payment.amount + (payment.lateFee || 0)).toFixed(2)}`, 30, yPos);
  yPos += 20;

  // Add payment status
  doc.setFontSize(14);
  doc.setTextColor(0, 150, 0);
  doc.text('PAID', pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Thank you for your payment.', pageWidth / 2, yPos, { align: 'center' });

  // Save the PDF to Firebase Storage
  const pdfBlob = doc.output('blob');
  const storageRef = ref(storage, `receipts/${payment.id}.pdf`);
  await uploadBytes(storageRef, pdfBlob);
  return await getDownloadURL(storageRef);
}