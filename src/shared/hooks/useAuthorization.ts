import { useAuthState } from './useAuthState';
import { Permission } from '@core/types/roles';
import { rolePermissions } from '@core/config/rolePermissions';

export const useAuthorization = () => {
  const { user } = useAuthState();
  const userRoles = user?.roles || [];

  const hasPermission = (requiredPermission: Permission): boolean => {
    if (!user) return false;

    return userRoles.some(role => {
      const permissions = rolePermissions[role];
      return permissions?.some(permission => 
        // Check for wildcard permission
        (permission.action === '*' && permission.resource === '*') ||
        // Check for resource wildcard
        (permission.action === requiredPermission.action && permission.resource === '*') ||
        // Check exact permission match
        (permission.action === requiredPermission.action && 
         permission.resource === requiredPermission.resource)
      );
    });
  };

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  return { hasPermission, hasRole };
};
