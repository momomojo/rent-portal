import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';

interface Report {
  id: string;
  title: string;
  type: 'financial' | 'occupancy' | 'maintenance' | 'custom';
  generatedAt: string;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  summary?: {
    totalRevenue?: number;
    occupancyRate?: number;
    maintenanceCount?: number;
  };
}

const Reports: React.FC = () => {
  const { user } = useAuthState();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  // Mock data - replace with actual API call
  const reports: Report[] = [];

  const renderReportCard = (report: Report) => (
    <div key={report.id} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              report.status === 'ready'
                ? 'bg-green-100 text-green-800'
                : report.status === 'generating'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">Period: {report.period}</p>
        <p className="text-sm text-gray-500">
          Generated: {report.generatedAt}
        </p>

        {report.summary && report.status === 'ready' && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {report.summary.totalRevenue !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ${report.summary.totalRevenue.toLocaleString()}
                </p>
              </div>
            )}
            {report.summary.occupancyRate !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Occupancy</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.summary.occupancyRate}%
                </p>
              </div>
            )}
            {report.summary.maintenanceCount !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.summary.maintenanceCount}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3">
        {report.status === 'ready' && (
          <>
            <button className="text-sm text-blue-600 hover:text-blue-500">
              View
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-500">
              Download
            </button>
          </>
        )}
        {report.status === 'failed' && (
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Retry
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
          <option value="all">All Reports</option>
          <option value="financial">Financial</option>
          <option value="occupancy">Occupancy</option>
          <option value="maintenance">Maintenance</option>
          <option value="custom">Custom</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Generate Report
      </button>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>

        <div className="mt-6">
          {renderFilters()}

          {reports.length === 0 ? (
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No reports
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by generating your first report.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Report
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map(renderReportCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
