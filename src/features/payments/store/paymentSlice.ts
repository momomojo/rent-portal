import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPayments,
  addPayment,
  updatePayment,
  setLoading,
  setError,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
