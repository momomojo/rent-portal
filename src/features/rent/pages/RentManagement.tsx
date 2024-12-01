import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/user';

interface RentPayment {
  id: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  tenant: {
    name: string;
    email: string;
  };
}

const RentManagement: React.FC = () => {
  const { user } = useAuthState();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('current');

  // Mock data - replace with actual API call
  const rentPayments: RentPayment[] = [];

  const renderPaymentCard = (payment: RentPayment) => (
    <div key={payment.id} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {payment.propertyName}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              payment.status === 'paid'
                ? 'bg-green-100 text-green-800'
                : payment.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Tenant: {payment.tenant.name}
          </p>
          <p className="text-sm text-gray-500">
            Due Date: {payment.dueDate}
          </p>
          {payment.paidDate && (
            <p className="text-sm text-gray-500">
              Paid Date: {payment.paidDate}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ${payment.amount.toLocaleString()}
          </span>
          {user?.role === UserRole.TENANT && payment.status === 'pending' && (
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Pay Now
            </button>
          )}
          {user?.role === UserRole.LANDLORD && (
            <button className="text-sm text-blue-600 hover:text-blue-500">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="current">Current Month</option>
          <option value="last">Last Month</option>
          <option value="next">Next Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Due</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">$0</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500">Paid This Month</h3>
        <p className="mt-1 text-2xl font-semibold text-green-600">$0</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
        <p className="mt-1 text-2xl font-semibold text-yellow-600">$0</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
        <p className="mt-1 text-2xl font-semibold text-red-600">$0</p>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === UserRole.TENANT ? 'My Rent' : 'Rent Management'}
        </h1>

        <div className="mt-6">
          {renderSummary()}
          {renderFilters()}

          {rentPayments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No rent payments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === UserRole.TENANT
                  ? 'You have no pending rent payments.'
                  : 'No rent payments to display.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rentPayments.map(renderPaymentCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentManagement;
