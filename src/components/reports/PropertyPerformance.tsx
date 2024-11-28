import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PropertyPerformanceProps {
  data: {
    id: string;
    name: string;
    revenue: number;
    expenses: number;
    occupancyRate: number;
    maintenanceRequests: number;
  }[];
}

export default function PropertyPerformance({ data }: PropertyPerformanceProps) {
  const [sortBy, setSortBy] = useState<keyof PropertyPerformanceProps['data'][0]>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  const handleSort = (key: keyof PropertyPerformanceProps['data'][0]) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Property
            </th>
            {['revenue', 'expenses', 'occupancyRate', 'maintenanceRequests'].map((key) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(key as keyof PropertyPerformanceProps['data'][0])}
              >
                <div className="flex items-center space-x-1">
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {sortBy === key && (
                    sortOrder === 'desc' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((property) => (
            <tr key={property.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {property.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.revenue.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.expenses.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.occupancyRate}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.maintenanceRequests}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}