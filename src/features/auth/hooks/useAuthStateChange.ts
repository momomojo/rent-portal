import { useState, useCallback, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../../core/firebase/config';
import { logger } from '../../../core/utils/logger';
import * as Sentry from '@sentry/react';

interface AuthStateError {
  code: string;
  message: string;
  retry?: () => Promise<void>;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/network-request-failed': 'Network connection failed. Please check your internet connection.',
  'auth/user-token-expired': 'Your session has expired. Please sign in again.',
  'auth/invalid-user-token': 'Authentication token is invalid. Please sign in again.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'default': 'An authentication error occurred. Please try again.'
};

export const useAuthStateChange = () => {
  const [error, setError] = useState<AuthStateError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const getAuthErrorMessage = (code: string): string => {
    return AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES.default;
  };

  const handleAuthError = useCallback((error: Error & { code?: string }) => {
    const errorCode = error.code || 'unknown';
    const authError: AuthStateError = {
      code: errorCode,
      message: getAuthErrorMessage(errorCode),
      retry: retryCount.current < maxRetries ? handleRetry : undefined
    };
    
    setError(authError);
    
    // Log to monitoring service
    logger.error('Auth State Change Error', {
      error,
      retryCount: retryCount.current,
      userId: auth.currentUser?.uid
    });

    // Report to Sentry
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'auth_state_change');
      scope.setContext('auth_error', {
        code: errorCode,
        retryCount: retryCount.current,
        userId: auth.currentUser?.uid
      });
      Sentry.captureException(error);
    });
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    retryCount.current += 1;

    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setCurrentUser(auth.currentUser);
        setError(null);
        retryCount.current = 0; // Reset retry count on success
      } else {
        throw new Error('No user to reload');
      }
    } catch (err) {
      handleAuthError(err as Error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setCurrentUser(user);
        if (error) setError(null);
        retryCount.current = 0;
      },
      (error) => {
        handleAuthError(error);
      }
    );

    return () => unsubscribe();
  }, [error, handleAuthError]);

  // Implement exponential backoff for retries
  const getRetryDelay = useCallback(() => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 8000; // 8 seconds
    const exponentialDelay = baseDelay * Math.pow(2, retryCount.current - 1);
    return Math.min(exponentialDelay, maxDelay);
  }, []);

  const retryWithBackoff = useCallback(async () => {
    if (isRetrying || !error?.retry) return;

    setIsRetrying(true);
    const delay = getRetryDelay();

    await new Promise(resolve => setTimeout(resolve, delay));
    await handleRetry();
  }, [error, isRetrying, getRetryDelay, handleRetry]);

  return {
    error,
    isRetrying,
    currentUser,
    retryWithBackoff,
    handleRetry
  };
};
