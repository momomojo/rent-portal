import { useState } from 'react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { withRoleVerification } from '../../middleware/roleVerification';
import UserInviteForm from '../../components/users/UserInviteForm';
import { useDropzone } from 'react-dropzone';
import { UserPlus, Download, Upload, Users } from 'lucide-react';

function UserManagement() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const { bulkImportUsers, exportUsers } = useUserManagement();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await bulkImportUsers(acceptedFiles[0]);
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            onClick={() => setShowInviteForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </button>
          <button
            onClick={exportUsers}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </button>
          <div
            {...getRootProps()}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </div>
        </div>
      </div>

      {/* User list and management interface */}
      <div className="mt-8">
        {/* Existing user management content */}
      </div>

      {showInviteForm && (
        <UserInviteForm onClose={() => setShowInviteForm(false)} />
      )}
    </div>
  );
}

export default withRoleVerification(UserManagement, ['admin']);