import { RootState } from '@core/store';
import { UserRole } from '@core/types/user';

export const mockInitialState: RootState = {
  auth: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  properties: {
    properties: [],
    selectedProperty: null,
    loading: false,
    error: null,
  },
  payments: {
    payments: [],
    selectedPayment: null,
    loading: false,
    error: null,
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
  },
  error: {
    global: null,
  },
};

export const mockAuthenticatedState: RootState = {
  ...mockInitialState,
  auth: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.TENANT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'test-token',
    loading: false,
    error: null,
  },
};

export const mockAdminState: RootState = {
  ...mockInitialState,
  auth: {
    ...mockAuthenticatedState.auth,
    user: {
      ...mockAuthenticatedState.auth.user!,
      role: UserRole.ADMIN,
    },
  },
};

export const mockLandlordState: RootState = {
  ...mockInitialState,
  auth: {
    ...mockAuthenticatedState.auth,
    user: {
      ...mockAuthenticatedState.auth.user!,
      role: UserRole.LANDLORD,
    },
  },
};
