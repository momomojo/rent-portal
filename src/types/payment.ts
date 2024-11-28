export interface Payment {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: number;
  createdAt: number;
  paidDate?: number;
  lateFee?: number;
  paymentMethod?: PaymentMethod;
  stripePaymentId?: string;
  notes?: string;
  isPartialPayment: boolean;
  remainingBalance?: number;
  isAutoPayEnabled: boolean;
  autoPayMethod?: PaymentMethod;
  autoPayDay?: number;
  receiptUrl?: string;
  securityDeposit?: SecurityDeposit;
}

export type PaymentType = 'rent' | 'deposit' | 'fee' | 'utility' | 'maintenance';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'partial' | 'failed';
export type PaymentMethod = 'card' | 'bank' | 'cash' | 'check';

export interface SecurityDeposit {
  amount: number;
  status: 'held' | 'partially-refunded' | 'fully-refunded';
  refundHistory?: DepositRefund[];
  deductions?: DepositDeduction[];
}

export interface DepositRefund {
  amount: number;
  date: number;
  reason: string;
  refundMethod: PaymentMethod;
  refundId?: string;
}

export interface DepositDeduction {
  amount: number;
  date: number;
  reason: string;
  category: 'damage' | 'cleaning' | 'unpaid-rent' | 'other';
  description: string;
  evidence?: string[];
}
