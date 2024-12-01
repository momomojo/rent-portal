import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '@core/config/firebase';
import { resetState } from '../store/authSlice';

// Session configuration
const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
const WARNING_THRESHOLD = 2 * 60 * 1000;  // 2 minutes warning
const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes inactivity

export const useSessionTimeout = () => {
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Refs for cleanup
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  const clearTimeouts = useCallback(() => {
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const handleSignOut = useCallback(async () => {
    clearTimeouts();
    try {
      await signOut(auth);
      dispatch(resetState());
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [clearTimeouts, dispatch]);

  const checkInactivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    if (timeSinceLastActivity >= INACTIVITY_THRESHOLD) {
      handleSignOut();
    }
  }, [handleSignOut]);

  const startWarningCountdown = useCallback(() => {
    setRemainingTime(WARNING_THRESHOLD / 1000);
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const updateLastActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const resetSession = useCallback(() => {
    clearTimeouts();
    setShowWarning(false);
    setRemainingTime(0);
    updateLastActivity();

    // Set warning timeout (2 minutes before session expires)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      startWarningCountdown();
    }, SESSION_DURATION - WARNING_THRESHOLD);

    // Set session timeout
    sessionTimeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, SESSION_DURATION);

    // Start inactivity check
    inactivityTimeoutRef.current = setInterval(checkInactivity, 1000);
  }, [
    clearTimeouts,
    updateLastActivity,
    startWarningCountdown,
    handleSignOut,
    checkInactivity
  ]);

  // Initialize user activity monitoring
  useEffect(() => {
    const events = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'mousemove',
      'click'
    ];

    const handleActivity = () => {
      if (!showWarning) {
        updateLastActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timeouts
    resetSession();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimeouts();
    };
  }, [showWarning, resetSession, updateLastActivity, clearTimeouts]);

  return {
    showWarning,
    remainingTime,
    resetSession,
    handleSignOut,
    isInactive: Date.now() - lastActivityRef.current >= INACTIVITY_THRESHOLD
  };
};