import { Permission, UserRole } from '@core/types';

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.TENANT]: [
    { action: 'read', resource: 'properties' },
    { action: 'create', resource: 'maintenance-requests' },
    { action: 'read', resource: 'maintenance-requests' },
    { action: 'update', resource: 'profile' },
    { action: 'read', resource: 'documents' },
  ],
  [UserRole.LANDLORD]: [
    { action: 'create', resource: 'properties' },
    { action: 'update', resource: 'properties' },
    { action: 'delete', resource: 'properties' },
    { action: 'manage', resource: 'tenants' },
    { action: 'manage', resource: 'maintenance-requests' },
    { action: 'manage', resource: 'documents' },
    { action: 'update', resource: 'profile' },
  ],
  [UserRole.ADMIN]: [
    { action: 'manage', resource: 'all' },
    { action: 'read', resource: 'analytics' },
    { action: 'manage', resource: 'users' },
    { action: 'manage', resource: 'settings' },
  ]
};
