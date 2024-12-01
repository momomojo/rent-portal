import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../store/authSlice';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

interface UseSessionManagementOptions {
  onSessionWarning?: () => void;
  onSessionTimeout?: () => void;
}

export const useSessionManagement = ({
  onSessionWarning,
  onSessionTimeout,
}: UseSessionManagementOptions = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef(Date.now());

  const resetTimers = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      onSessionWarning?.();
    }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

    // Set session timeout
    sessionTimeoutRef.current = setTimeout(() => {
      dispatch(signOut());
      onSessionTimeout?.();
      navigate('/login');
    }, SESSION_TIMEOUT);
  }, [dispatch, navigate, onSessionWarning, onSessionTimeout]);

  const checkInactivity = useCallback(() => {
    const now = Date.now();
    if (now - lastActivityRef.current > INACTIVITY_TIMEOUT) {
      dispatch(signOut());
      onSessionTimeout?.();
      navigate('/login');
    }
  }, [dispatch, navigate, onSessionTimeout]);

  const handleUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    resetTimers();
  }, [resetTimers]);

  const extendSession = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);

  useEffect(() => {
    // Set up activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Set up inactivity checker
    const inactivityChecker = setInterval(checkInactivity, 60000); // Check every minute

    // Initialize timers
    resetTimers();

    return () => {
      // Clean up
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(inactivityChecker);
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleUserActivity, checkInactivity, resetTimers]);

  return {
    extendSession,
    sessionTimeoutDuration: SESSION_TIMEOUT,
    warningDuration: WARNING_BEFORE_TIMEOUT,
    inactivityDuration: INACTIVITY_TIMEOUT,
  };
};
