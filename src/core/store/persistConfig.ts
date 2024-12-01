import { persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { RootState } from './types';

// Transform for cleaning sensitive data before persistence
const cleanseDataForStorage = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (inboundState, key) => {
    switch (key) {
      case 'auth':
        return {
          ...inboundState,
          error: null,
          loading: false,
          // Keep only essential auth data
          user: inboundState.user ? {
            uid: inboundState.user.uid,
            email: inboundState.user.email,
            role: inboundState.user.role,
            emailVerified: inboundState.user.emailVerified
          } : null
        };
      case 'ui':
        // Don't persist UI state
        return undefined;
      default:
        return inboundState;
    }
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  (outboundState, key) => {
    switch (key) {
      case 'auth':
        return {
          ...outboundState,
          initialized: false,
          loading: false,
          error: null
        };
      default:
        return outboundState;
    }
  },
  // transformation configuration
  {
    whitelist: ['auth', 'settings', 'properties']
  }
);

// Configure state persistence
export const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'settings', 'properties'],
  transforms: [cleanseDataForStorage],
  migrate: (state: RootState) => {
    // Handle state migrations here
    return Promise.resolve(state);
  },
  debug: process.env.NODE_ENV !== 'production'
};