export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: number;
  updatedAt?: number;
  status: 'active' | 'inactive' | 'pending';
  assignedLandlord?: string;
  assignedTenants?: string[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  settings: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    timezone: string;
  };
  lastLogin?: number;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: number;
  expiresAt: number;
  token: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  startTime: number;
  lastActivity: number;
  active: boolean;
}