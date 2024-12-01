import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthState } from './useAuthState';
import type { UserRole } from '../types/user';

export function useRoleAccess() {
  const { user } = useAuthState();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setRole(userData.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isLandlord: role === 'landlord',
    isTenant: role === 'tenant',
    canManageProperties: role === 'admin' || role === 'landlord',
    canViewAllProperties: role === 'admin',
    canEditProperty: role === 'admin' || role === 'landlord',
    canAssignTenants: role === 'admin',
    canManageRent: role === 'admin' || role === 'landlord',
  };
}