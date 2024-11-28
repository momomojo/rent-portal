import { useState } from 'react';
import { RolePermissions } from '../../types/settings';
import { Shield } from 'lucide-react';

interface RoleSettingsProps {
  settings: RolePermissions;
  onUpdate: (settings: RolePermissions) => void;
}

const DEFAULT_PERMISSIONS = {
  'view_dashboard': true,
  'manage_properties': false,
  'manage_tenants': false,
  'manage_payments': false,
  'manage_maintenance': false,
  'view_reports': false,
  'manage_settings': false,
  'manage_documents': false,
  'manage_roles': false,
};

export default function RoleSettings({ settings, onUpdate }: RoleSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const handlePermissionChange = (role: string, permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Role Permissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure access permissions for each user role.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              {Object.entries(formData).map(([role, permissions]) => (
                <div key={role} className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 capitalize mb-4">{role}</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(permissions).map(([permission, enabled]) => (
                      <div key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => handlePermissionChange(role, permission, e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled={role === 'admin' && permission === 'manage_roles'} // Admin always has role management
                        />
                        <label className="ml-2 block text-sm text-gray-900 capitalize">
                          {permission.replace(/_/g, ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}