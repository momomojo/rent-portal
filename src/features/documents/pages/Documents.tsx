import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';
import { UserRole } from '@core/types/user';

interface Document {
  id: string;
  name: string;
  type: 'lease' | 'contract' | 'notice' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: 'active' | 'archived' | 'pending';
  propertyId?: string;
  propertyName?: string;
}

const Documents: React.FC = () => {
  const { user } = useAuthState();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('list');

  // Mock data - replace with actual API call
  const documents: Document[] = [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDocumentCard = (document: Document) => (
    <div
      key={document.id}
      className={`bg-white shadow rounded-lg overflow-hidden ${
        view === 'list' ? 'flex items-center' : ''
      }`}
    >
      <div className={`p-4 ${view === 'list' ? 'flex-1 flex items-center' : ''}`}>
        <div className={view === 'list' ? 'flex-1' : ''}>
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {document.name}
              </h3>
              <p className="text-sm text-gray-500">
                {document.propertyName && `Property: ${document.propertyName}`}
              </p>
            </div>
          </div>
          {view === 'list' && (
            <div className="mt-2 sm:mt-0 sm:ml-6 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {formatFileSize(document.size)}
              </span>
              <span className="text-sm text-gray-500">
                Uploaded: {document.uploadedAt}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  document.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : document.status === 'archived'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
            </div>
          )}
        </div>
        {view === 'grid' && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatFileSize(document.size)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                document.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : document.status === 'archived'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </span>
          </div>
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
          View
        </button>
        <button className="text-sm text-blue-600 hover:text-blue-500">
          Download
        </button>
        {user?.role === UserRole.LANDLORD && (
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Archive
          </button>
        )}
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
          <option value="all">All Documents</option>
          <option value="lease">Leases</option>
          <option value="contract">Contracts</option>
          <option value="notice">Notices</option>
          <option value="other">Other</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
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
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          {user?.role === UserRole.LANDLORD && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Upload Document
            </button>
          )}
        </div>

        <div className="mt-6">
          {renderFilters()}

          {documents.length === 0 ? (
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
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No documents
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === UserRole.LANDLORD
                  ? 'Get started by uploading your first document.'
                  : 'No documents have been shared with you yet.'}
              </p>
              {user?.role === UserRole.LANDLORD && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {documents.map(renderDocumentCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
