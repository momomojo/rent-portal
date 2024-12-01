import { useSelector } from 'react-redux';
import { RootState } from '@core/store/types';

export function useAuthState() {
  const { user, loading, initialized, error } = useSelector((state: RootState) => state.auth);
  
  return {
    user,
    loading,
    initialized,
    error,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLandlord: user?.role === 'landlord',
    isTenant: user?.role === 'tenant',
  };
}
