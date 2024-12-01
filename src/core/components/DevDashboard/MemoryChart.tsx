import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { muiPerformanceMonitor } from '../../monitoring/materialUI';

interface MemoryChartProps {
  componentName?: string;
}

export const MemoryChart: React.FC<MemoryChartProps> = ({ componentName }) => {
  const metrics = componentName 
    ? muiPerformanceMonitor.getComponentMetrics(componentName)
    : undefined;

  if (!metrics?.memoryHistory?.length) {
    return <div className="text-gray-500">No memory data available</div>;
  }

  const data = metrics.memoryHistory.map((value, index) => ({
    index,
    memory: value / (1024 * 1024), // Convert to MB
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis 
            label={{ value: 'Memory Usage (MB)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)} MB`, 'Memory Usage']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#82ca9d"
            name="Memory Usage"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
