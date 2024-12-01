import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { networkMonitor } from '../../../monitoring/network';
import { performanceBudgetMonitor } from '../../../monitoring/budgets';

export const NetworkView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const networkMetrics = networkMonitor.getMetrics();
  const endpoints = Array.from(networkMetrics.keys());
  const budgets = performanceBudgetMonitor.getBudgets()
    .filter(b => b.type === 'network');

  const selectedMetrics = selectedEndpoint
    ? networkMonitor.getRequestHistory(selectedEndpoint)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Response Times</h3>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="">All Endpoints</option>
            {endpoints.map(endpoint => (
              <option key={endpoint} value={endpoint}>{endpoint}</option>
            ))}
          </select>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedMetrics || Array.from(networkMetrics.values())}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
              />
              <YAxis
                label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(2)}ms`]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#8884d8"
                name="Response Time"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">Success Rates</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Array.from(networkMetrics.entries()).map(([endpoint, metrics]) => ({
              endpoint,
              successRate: metrics.successRate
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="endpoint" />
              <YAxis
                label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`]} />
              <Bar
                dataKey="successRate"
                fill="#82ca9d"
                name="Success Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Array.from(networkMetrics.entries()).map(([endpoint, metrics]) => {
          const budget = budgets.find(b => b.component === endpoint);
          const isOverBudget = budget && metrics.responseTime > budget.threshold;

          return (
            <div
              key={endpoint}
              className={`bg-white rounded-lg p-4 shadow ${
                isOverBudget ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-2">{endpoint}</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Average Response Time</p>
                  <div className="flex items-center">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${Math.min(metrics.responseTime, 100)}px`,
                        backgroundColor: isOverBudget ? '#FCA5A5' : '#86EFAC'
                      }}
                    />
                    <span className="ml-2 text-sm">
                      {metrics.responseTime.toFixed(2)}ms
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <div className="flex items-center">
                    <div
                      className="h-2 bg-blue-200 rounded"
                      style={{
                        width: `${metrics.successRate}px`
                      }}
                    />
                    <span className="ml-2 text-sm">
                      {metrics.successRate.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-sm">{metrics.totalRequests.toLocaleString()}</p>
                </div>

                {budget && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Budget: {budget.threshold}ms
                      {isOverBudget && (
                        <span className="ml-2 text-red-600">
                          (Exceeded by {(metrics.responseTime - budget.threshold).toFixed(2)}ms)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
