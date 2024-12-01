import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '@core/config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  sendEmailVerification,
  applyActionCode,
} from 'firebase/auth';
import { getActionCodeSettings } from '@core/config/firebase';

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: 'admin' | 'landlord' | 'tenant' | null;
    emailVerified: boolean;
  } | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  emailVerification: {
    lastSentAt: number | null;
    attempts: number;
    verificationEmailSent: boolean;
    error: string | null;
    verificationInProgress: boolean;
  };
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
  emailVerification: {
    lastSentAt: null,
    attempts: 0,
    verificationEmailSent: false,
    error: null,
    verificationInProgress: false,
  },
};

// Existing async thunks...
[Previous async thunk implementations]

// Add new async thunk for email verification
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (code: string, { rejectWithValue }) => {
    try {
      await applyActionCode(auth, code);
      if (auth.currentUser) {
        await auth.currentUser.reload();
        return auth.currentUser.emailVerified;
      }
      return false;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ... existing reducers
    setEmailVerificationError: (state, action: PayloadAction<string | null>) => {
      state.emailVerification.error = action.payload;
    },
    incrementVerificationAttempts: (state) => {
      state.emailVerification.attempts += 1;
      state.emailVerification.lastSentAt = Date.now();
    },
    resetVerificationAttempts: (state) => {
      state.emailVerification.attempts = 0;
      state.emailVerification.lastSentAt = null;
    },
    setVerificationInProgress: (state, action: PayloadAction<boolean>) => {
      state.emailVerification.verificationInProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ... existing cases
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.emailVerification.verificationInProgress = true;
        state.emailVerification.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        if (state.user) {
          state.user.emailVerified = action.payload;
        }
        state.emailVerification.verificationInProgress = false;
        state.emailVerification.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerification.verificationInProgress = false;
        state.emailVerification.error = action.error.message || 'Verification failed';
      });
      // ... rest of your existing cases
  },
});

export const { 
  setUser, 
  setUserRole, 
  setLoading, 
  setInitialized, 
  clearError, 
  resetState, 
  resetVerificationState,
  setEmailVerificationError,
  incrementVerificationAttempts,
  resetVerificationAttempts,
  setVerificationInProgress
} = authSlice.actions;

export const authReducer = authSlice.reducer;