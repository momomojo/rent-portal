import { useState, useCallback } from 'react';
import { RateLimiter } from '../api/middleware/RateLimiter';
import { toast } from 'react-toastify';

export const useRateLimitedAuth = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const rateLimiter = RateLimiter.getInstance();

  const checkRateLimit = useCallback((identifier: string) => {
    const { allowed, waitTime } = rateLimiter.checkRateLimit(identifier);
    
    if (!allowed) {
      setIsBlocked(true);
      const minutes = Math.ceil(waitTime / (60 * 1000));
      toast.error(`Too many attempts. Please try again in ${minutes} minutes.`);
      
      // Set a timer to unblock
      setTimeout(() => {
        setIsBlocked(false);
        rateLimiter.resetAttempts(identifier);
      }, waitTime);
      
      return false;
    }
    
    return true;
  }, []);

  return {
    isBlocked,
    checkRateLimit
  };
};
