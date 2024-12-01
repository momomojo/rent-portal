export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
  MAINTENANCE = 'maintenance',
  AGENT = 'agent'
}

export interface Permission {
  action: string;
  resource: string;
}

export interface UserPermissions {
  roles: UserRole[];
  permissions: Permission[];
}
