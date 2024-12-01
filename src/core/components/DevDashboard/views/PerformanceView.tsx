import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { usePerformanceMetrics } from '../../../hooks/usePerformanceMetrics';
import { performanceBudgetMonitor } from '../../../monitoring/budgets';

export const PerformanceView: React.FC<{
  selectedMetric: string;
  data: Array<{ timestamp: number; value: number; name: string }>;
}> = ({ selectedMetric, data }) => {
  const { metrics } = usePerformanceMetrics();
  const budgets = performanceBudgetMonitor.getBudgets();

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}ms`,
                name
              ]}
            />
            <Legend />
            {selectedMetric === 'all' ? (
              data.map((entry) => {
                const budget = budgets.find(b => b.component === entry.name);
                return (
                  <React.Fragment key={entry.name}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      data={data.filter(d => d.name === entry.name)}
                      name={entry.name}
                      stroke={`hsl(${entry.name.length * 137.5}, 70%, 50%)`}
                      dot={false}
                    />
                    {budget && (
                      <ReferenceLine
                        y={budget.threshold}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={`Budget: ${budget.threshold}ms`}
                      />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                />
                {budgets
                  .filter(b => b.component === selectedMetric)
                  .map((budget, index) => (
                    <ReferenceLine
                      key={index}
                      y={budget.threshold}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={`Budget: ${budget.threshold}ms`}
                    />
                  ))}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">Performance Budgets</h3>
        <div className="space-y-2">
          {budgets.map((budget, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">
                {budget.component || 'Global'} ({budget.type})
              </span>
              <span className="text-sm text-gray-600">
                Threshold: {budget.threshold}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
