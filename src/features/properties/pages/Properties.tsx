import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/user';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
}

const Properties: React.FC = () => {
  const { user } = useAuthState();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Mock data - replace with actual API call
  const properties: Property[] = [];

  const renderPropertyCard = (property: Property) => (
    <div key={property.id} className="bg-white shadow rounded-lg overflow-hidden">
      <img
        src={property.imageUrl}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
        <p className="text-sm text-gray-500">{property.address}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'available'
              ? 'bg-green-100 text-green-800'
              : property.status === 'rented'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
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
          <option value="all">All Properties</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
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
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          {user?.role === UserRole.LANDLORD && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add Property
            </button>
          )}
        </div>

        <div className="mt-6">
          {renderFilters()}

          {properties.length === 0 ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === UserRole.LANDLORD
                  ? 'Get started by adding a new property.'
                  : 'No properties are currently available.'}
              </p>
              {user?.role === UserRole.LANDLORD && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Property
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-6'
              }
            >
              {properties.map(renderPropertyCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
