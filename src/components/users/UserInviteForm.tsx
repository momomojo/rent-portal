import { useState } from 'react';
import { UserRole } from '../../types/user';
import { useUserManagement } from '../../hooks/useUserManagement';
import { Mail } from 'lucide-react';

interface UserInviteFormProps {
  onClose: () => void;
}

export default function UserInviteForm({ onClose }: UserInviteFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('tenant');
  const { inviteUser } = useUserManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteUser(email, role);
      onClose();
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Invite User</h3>
            <p className="mt-1 text-sm text-gray-500">
              Send an invitation to join the platform
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}