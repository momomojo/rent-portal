export enum UserRole {
  ADMIN = 'ADMIN',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
