import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { muiPerformanceMonitor } from '../../../monitoring/materialUI';
import { performanceBudgetMonitor } from '../../../monitoring/budgets';

interface MemoryData {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  components: Record<string, number>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const useMemoryMetrics = () => {
  const [memoryData, setMemoryData] = useState<MemoryData[]>([]);
  const [componentMemory, setComponentMemory] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateMemory = () => {
      if (performance.memory) {
        const components = Array.from(muiPerformanceMonitor.getAllMetrics().entries())
          .reduce((acc, [name, metrics]) => ({
            ...acc,
            [name]: metrics.peakMemoryUsage || 0
          }), {});

        const newData: MemoryData = {
          timestamp: Date.now(),
          heapUsed: performance.memory.usedJSHeapSize / (1024 * 1024),
          heapTotal: performance.memory.totalJSHeapSize / (1024 * 1024),
          external: performance.memory.jsHeapSizeLimit / (1024 * 1024),
          components
        };

        setMemoryData(prev => [...prev.slice(-50), newData]);
        setComponentMemory(components);
      }
    };

    const interval = setInterval(updateMemory, 1000);
    return () => clearInterval(interval);
  }, []);

  return { memoryData, componentMemory };
};

const GlobalMemoryChart: React.FC<{ data: MemoryData[] }> = ({ data }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <h3 className="text-lg font-semibold mb-3">Global Memory Usage</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            formatter={(value: number) => [`${value.toFixed(2)} MB`]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="heapUsed"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            name="Heap Used"
          />
          <Area
            type="monotone"
            dataKey="heapTotal"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Heap Total"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ComponentMemoryBreakdown: React.FC<{
  componentMemory: Record<string, number>;
}> = ({ componentMemory }) => {
  const data = Object.entries(componentMemory)
    .map(([name, value]) => ({
      name,
      value: value / (1024 * 1024)
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">Component Memory Distribution</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}MB`}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} MB`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map(({ name, value }, index) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{name}</span>
              </div>
              <span className="text-sm font-medium">{value.toFixed(2)} MB</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MemoryBudgets: React.FC = () => {
  const budgets = performanceBudgetMonitor.getBudgets()
    .filter(b => b.type === 'memory');
  const violations = performanceBudgetMonitor.getViolations()
    .filter(v => v.budget.type === 'memory');

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">Memory Budgets</h3>
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const componentViolations = violations
            .filter(v => v.budget === budget)
            .length;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {budget.component || 'Global'}
                </span>
                <span className="text-sm">
                  Threshold: {(budget.threshold / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              {componentViolations > 0 && (
                <div className="text-xs text-red-600">
                  {componentViolations} violations detected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MemoryView: React.FC = () => {
  const { memoryData, componentMemory } = useMemoryMetrics();

  return (
    <div className="space-y-6">
      <GlobalMemoryChart data={memoryData} />
      <ComponentMemoryBreakdown componentMemory={componentMemory} />
      <MemoryBudgets />
    </div>
  );
};
