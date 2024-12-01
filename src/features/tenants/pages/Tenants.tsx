import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'pending' | 'past';
  rentAmount: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentDate?: string;
}

const Tenants: React.FC = () => {
  const { user } = useAuthState();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState<'grid' | 'list'>('list');

  // Mock data - replace with actual API call
  const tenants: Tenant[] = [];

  const renderTenantCard = (tenant: Tenant) => (
    <div
      key={tenant.id}
      className={`bg-white shadow rounded-lg overflow-hidden ${
        view === 'list' ? 'flex items-center' : ''
      }`}
    >
      <div className={`p-4 ${view === 'list' ? 'flex-1 flex items-center' : ''}`}>
        <div className={view === 'list' ? 'flex-1' : ''}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{tenant.name}</h3>
              <p className="text-sm text-gray-500">{tenant.propertyName}</p>
            </div>
          </div>
          {view === 'list' && (
            <div className="mt-2 sm:mt-0 sm:ml-6 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Lease: {tenant.leaseStart} - {tenant.leaseEnd}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : tenant.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : tenant.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Rent: {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
              </span>
            </div>
          )}
        </div>
        {view === 'grid' && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Lease: {tenant.leaseStart} - {tenant.leaseEnd}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : tenant.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                ${tenant.rentAmount}/month
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : tenant.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
              </span>
            </div>
          </>
        )}
      </div>
      <div
        className={`${
          view === 'list'
            ? 'px-4 py-2 flex items-center space-x-2'
            : 'px-4 py-3 bg-gray-50 flex justify-end space-x-3'
        }`}
      >
        <button className="text-sm text-blue-600 hover:text-blue-500">
          View Details
        </button>
        <button className="text-sm text-blue-600 hover:text-blue-500">
          Message
        </button>
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
          <option value="all">All Tenants</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="past">Past</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="name">Name</option>
          <option value="property">Property</option>
          <option value="leaseEnd">Lease End Date</option>
          <option value="status">Status</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-md ${
            view === 'grid'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-2 rounded-md ${
            view === 'list'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Tenant
          </button>
        </div>

        <div className="mt-6">
          {renderFilters()}

          {tenants.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tenants
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first tenant.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Tenant
                </button>
              </div>
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {tenants.map(renderTenantCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tenants;
