import { useState } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types/user';
import { toast } from 'sonner';
import Papa from 'papaparse';

export function useUserManagement() {
  const [loading, setLoading] = useState(false);

  const inviteUser = async (email: string, role: UserRole) => {
    try {
      setLoading(true);
      // Create invitation record
      await addDoc(collection(db, 'invitations'), {
        email,
        role,
        status: 'pending',
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send invitation email (implement email service integration)
      // This would typically be handled by a backend service

      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to send invitation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const bulkImportUsers = async (file: File) => {
    try {
      setLoading(true);
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          const users = results.data as Array<{
            email: string;
            role: UserRole;
            name: string;
          }>;

          for (const user of users) {
            await inviteUser(user.email, user.role);
          }

          toast.success(`Successfully imported ${users.length} users`);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast.error('Failed to parse CSV file');
        }
      });
    } catch (error) {
      console.error('Error importing users:', error);
      toast.error('Failed to import users');
    } finally {
      setLoading(false);
    }
  };

  const exportUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());

      const csv = Papa.unparse(users);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'users.csv';
      link.click();

      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: Date.now()
      });
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', userId), {
        status: 'inactive',
        updatedAt: Date.now()
      });
      toast.success('User deactivated successfully');
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    inviteUser,
    bulkImportUsers,
    exportUsers,
    updateUserRole,
    deactivateUser
  };
}