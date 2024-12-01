import React from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/user';

const Dashboard: React.FC = () => {
  const { user } = useAuthState();

  const renderTenantDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">My Rentals</h3>
        {/* TODO: Add rental list component */}
        <p className="text-gray-500 mt-2">No active rentals found.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
        {/* TODO: Add payment history component */}
        <p className="text-gray-500 mt-2">No payment history available.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
        {/* TODO: Add maintenance requests component */}
        <p className="text-gray-500 mt-2">No maintenance requests found.</p>
      </div>
    </div>
  );

  const renderLandlordDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">My Properties</h3>
        {/* TODO: Add properties list component */}
        <p className="text-gray-500 mt-2">No properties listed.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Tenant Overview</h3>
        {/* TODO: Add tenant overview component */}
        <p className="text-gray-500 mt-2">No active tenants.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
        {/* TODO: Add financial summary component */}
        <p className="text-gray-500 mt-2">No financial data available.</p>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6">
          {user?.role === UserRole.TENANT
            ? renderTenantDashboard()
            : renderLandlordDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
