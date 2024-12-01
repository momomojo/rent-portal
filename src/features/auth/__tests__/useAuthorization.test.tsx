import { renderHook } from '@testing-library/react-hooks';
import { useAuthorization } from '@shared/hooks/useAuthorization';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/roles';

// Mock useAuthState
jest.mock('@shared/hooks/useAuthState', () => ({
  useAuthState: jest.fn()
}));

describe('useAuthorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false for all permissions when user is not authenticated', () => {
    (useAuthState as jest.Mock).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useAuthorization());
    
    expect(result.current.hasPermission({ action: 'read', resource: 'properties' })).toBe(false);
    expect(result.current.hasRole(UserRole.TENANT)).toBe(false);
  });

  it('should check tenant permissions correctly', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { roles: [UserRole.TENANT] }
    });
    
    const { result } = renderHook(() => useAuthorization());
    
    // Tenant should have these permissions
    expect(result.current.hasPermission({ action: 'read', resource: 'properties' })).toBe(true);
    expect(result.current.hasPermission({ action: 'create', resource: 'maintenance-requests' })).toBe(true);
    
    // Tenant should not have these permissions
    expect(result.current.hasPermission({ action: 'create', resource: 'properties' })).toBe(false);
    expect(result.current.hasPermission({ action: 'delete', resource: 'properties' })).toBe(false);
  });

  it('should check landlord permissions correctly', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { roles: [UserRole.LANDLORD] }
    });
    
    const { result } = renderHook(() => useAuthorization());
    
    // Landlord should have these permissions
    expect(result.current.hasPermission({ action: 'create', resource: 'properties' })).toBe(true);
    expect(result.current.hasPermission({ action: 'update', resource: 'properties' })).toBe(true);
    expect(result.current.hasPermission({ action: 'read', resource: 'maintenance-requests' })).toBe(true);
    
    // Landlord should not have these permissions
    expect(result.current.hasPermission({ action: 'delete', resource: 'users' })).toBe(false);
  });

  it('should grant all permissions to admin role', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { roles: [UserRole.ADMIN] }
    });
    
    const { result } = renderHook(() => useAuthorization());
    
    // Admin should have all permissions
    expect(result.current.hasPermission({ action: 'create', resource: 'properties' })).toBe(true);
    expect(result.current.hasPermission({ action: 'delete', resource: 'users' })).toBe(true);
    expect(result.current.hasPermission({ action: 'update', resource: 'settings' })).toBe(true);
  });

  it('should handle multiple roles correctly', () => {
    (useAuthState as jest.Mock).mockReturnValue({
      user: { roles: [UserRole.TENANT, UserRole.AGENT] }
    });
    
    const { result } = renderHook(() => useAuthorization());
    
    // Should have combined permissions from both roles
    expect(result.current.hasPermission({ action: 'read', resource: 'properties' })).toBe(true);
    expect(result.current.hasPermission({ action: 'create', resource: 'properties' })).toBe(true);
    expect(result.current.hasRole(UserRole.TENANT)).toBe(true);
    expect(result.current.hasRole(UserRole.AGENT)).toBe(true);
  });
});
