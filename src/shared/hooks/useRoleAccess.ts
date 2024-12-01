import { useAuthState } from './useAuthState';
import { UserRole } from '@core/types/user';

export const useRoleAccess = () => {
  const { user } = useAuthState();
  console.log('Checking role access for user:', user);

  const hasAccess = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return { 
    hasAccess,
    isAdmin: user?.role === 'admin',
    isLandlord: user?.role === 'landlord',
    isTenant: user?.role === 'tenant',
  };
};
