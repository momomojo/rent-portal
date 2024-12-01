import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        
        <div className="mt-6 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            {/* TODO: Add user management component */}
            <p className="text-gray-500 mt-2">No users to display.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Property Overview</h3>
            {/* TODO: Add property overview component */}
            <p className="text-gray-500 mt-2">No properties to display.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">System Analytics</h3>
            {/* TODO: Add system analytics component */}
            <p className="text-gray-500 mt-2">No analytics data available.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
            {/* TODO: Add audit logs component */}
            <p className="text-gray-500 mt-2">No audit logs available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
