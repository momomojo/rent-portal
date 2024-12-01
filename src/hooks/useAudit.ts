import { useCallback } from 'react';
import { useAuthState } from './useAuthState';
import { logAudit } from '../utils/security';

export function useAudit() {
  const { user } = useAuthState();

  const logAction = useCallback(async (
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    if (!user) return;

    await logAudit({
      userId: user.uid,
      action,
      resource,
      resourceId,
      details,
      ipAddress: '127.0.0.1', // In production, get from server
      userAgent: navigator.userAgent,
    });
  }, [user]);

  return { logAction };
}