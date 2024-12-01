import { useState } from 'react';
import { DollarSign, Home, Percent, Wrench, Download } from 'lucide-react';
import RevenueChart from '../../components/reports/RevenueChart';
import OccupancyRates from '../../components/reports/OccupancyRates';
import PaymentCollectionRates from '../../components/reports/PaymentCollectionRates';
import MaintenanceCosts from '../../components/reports/MaintenanceCosts';
import PropertyPerformance from '../../components/reports/PropertyPerformance';
import { useReports } from '../../hooks/useReports';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const { revenueData, occupancyData, paymentData, maintenanceData, propertyPerformance, loading } = useReports(dateRange);
  const { isAdmin } = useRoleAccess();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    const data = {
      revenue: revenueData,
      occupancy: occupancyData,
      payments: paymentData,
      maintenance: maintenanceData,
      performance: propertyPerformance
    };

    if (format === 'csv') {
      exportToCSV(data, `rental-report-${dateRange}`);
    } else {
      exportToPDF(data, `rental-report-${dateRange}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            View detailed reports and performance metrics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${revenueData.total.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Home className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Occupancy Rate
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {occupancyData.rate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Percent className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Collection Rate
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {paymentData.collectionRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maintenance Costs
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${maintenanceData.total.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
          <RevenueChart data={revenueData.trends} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Occupancy Rates</h3>
          <OccupancyRates data={occupancyData.trends} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Collection</h3>
          <PaymentCollectionRates data={paymentData.trends} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Costs</h3>
          <MaintenanceCosts data={maintenanceData.trends} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Performance</h3>
          <PropertyPerformance data={propertyPerformance} />
        </div>
      </div>
    </div>
  );
}