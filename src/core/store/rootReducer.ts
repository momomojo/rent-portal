import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../../features/auth/store/authSlice';
import { propertyReducer } from '../../features/properties/store/propertySlice';
import { paymentReducer } from '../../features/payments/store/paymentSlice';
import { uiReducer } from './slices/uiSlice';
import { errorReducer } from './slices/errorSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  properties: propertyReducer,
  payments: paymentReducer,
  ui: uiReducer,
  error: errorReducer,
});
