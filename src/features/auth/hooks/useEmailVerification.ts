import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '@core/config/firebase';
import { sendEmailVerification, applyActionCode } from 'firebase/auth';
import { getActionCodeSettings } from '@core/config/firebase';
import { RootState } from '@core/store/types';
import { setEmailVerificationError, incrementVerificationAttempts } from '../store/authSlice';

interface UseEmailVerificationOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export const useEmailVerification = (options: UseEmailVerificationOptions = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 8000
  } = options;

  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { emailVerification } = useSelector((state: RootState) => state.auth);

  const sendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) {
      const error = 'No user is currently signed in';
      setError(error);
      dispatch(setEmailVerificationError(error));
      return;
    }

    // Check if we've hit the rate limit
    if (emailVerification.attempts >= 5) {
      const error = 'Too many attempts. Please try again later.';
      setError(error);
      dispatch(setEmailVerificationError(error));
      return;
    }

    // Check cooldown period
    const cooldownPeriod = 60 * 1000; // 60 seconds
    if (emailVerification.lastSentAt && Date.now() - emailVerification.lastSentAt < cooldownPeriod) {
      const error = 'Please wait before requesting another email.';
      setError(error);
      dispatch(setEmailVerificationError(error));
      return;
    }

    setSending(true);
    setError(null);
    dispatch(setEmailVerificationError(null));

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await sendEmailVerification(auth.currentUser, getActionCodeSettings());
        dispatch(incrementVerificationAttempts());
        setSending(false);
        return;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
        
        // If this is our last attempt, set the error
        if (attempt === maxRetries - 1) {
          setError(errorMessage);
          dispatch(setEmailVerificationError(errorMessage));
          setSending(false);
          return;
        }

        // Otherwise, wait before retrying
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [dispatch, maxRetries, baseDelay, maxDelay, emailVerification.attempts, emailVerification.lastSentAt]);

  const checkVerificationStatus = useCallback(async () => {
    if (!auth.currentUser) return false;
    
    try {
      await auth.currentUser.reload();
      return auth.currentUser.emailVerified;
    } catch (err) {
      console.error('Error checking verification status:', err);
      return false;
    }
  }, []);

  const verifyEmail = useCallback(async (code: string) => {
    try {
      await applyActionCode(auth, code);
      await auth.currentUser?.reload();
      return auth.currentUser?.emailVerified || false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
      setError(errorMessage);
      dispatch(setEmailVerificationError(errorMessage));
      return false;
    }
  }, [dispatch]);

  return {
    sending,
    error,
    sendVerificationEmail,
    checkVerificationStatus,
    verifyEmail,
    attempts: emailVerification.attempts,
    lastSentAt: emailVerification.lastSentAt
  };
};