import React, { useState } from 'react';
import { muiPerformanceMonitor } from '../../../monitoring/materialUI';
import { performanceBudgetMonitor } from '../../../monitoring/budgets';

interface ComponentMetrics {
  renderTime: number;
  memoryUsage?: number;
  renderCount: number;
  lastUpdate: number;
}

export const ComponentsView: React.FC = () => {
  const [sortBy, setSortBy] = useState<'renderTime' | 'memory' | 'renders'>('renderTime');
  const components = Array.from(muiPerformanceMonitor.getAllMetrics().entries());
  const budgets = performanceBudgetMonitor.getBudgets();

  const sortedComponents = [...components].sort((a, b) => {
    switch (sortBy) {
      case 'renderTime':
        return b[1].averageRenderTime - a[1].averageRenderTime;
      case 'memory':
        return (b[1].peakMemoryUsage || 0) - (a[1].peakMemoryUsage || 0);
      case 'renders':
        return b[1].renderCount - a[1].renderCount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Component Performance</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="p-1 border rounded"
        >
          <option value="renderTime">Sort by Render Time</option>
          <option value="memory">Sort by Memory Usage</option>
          <option value="renders">Sort by Render Count</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedComponents.map(([name, metrics]) => {
          const budget = budgets.find(b => b.component === name);
          const isOverBudget = budget && metrics.averageRenderTime > budget.threshold;

          return (
            <div
              key={name}
              className={`bg-white rounded-lg p-4 shadow ${
                isOverBudget ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{name}</h4>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(metrics.lastRenderTimestamp).toLocaleTimeString()}
                  </p>
                </div>
                {isOverBudget && (
                  <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                    Over Budget
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Average Render Time</p>
                  <div className="mt-1 flex items-center">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${Math.min(metrics.averageRenderTime * 2, 100)}px`,
                        backgroundColor: metrics.averageRenderTime > 16 ? '#FCA5A5' : '#86EFAC'
                      }}
                    />
                    <span className="ml-2 text-sm">
                      {metrics.averageRenderTime.toFixed(2)}ms
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Memory Usage</p>
                  {metrics.peakMemoryUsage ? (
                    <div className="mt-1 flex items-center">
                      <div
                        className="h-2 bg-blue-200 rounded"
                        style={{
                          width: `${Math.min((metrics.peakMemoryUsage / (1024 * 1024)), 100)}px`
                        }}
                      />
                      <span className="ml-2 text-sm">
                        {(metrics.peakMemoryUsage / (1024 * 1024)).toFixed(2)}MB
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not available</span>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Render Count</p>
                  <p className="mt-1 text-sm">
                    {metrics.renderCount.toLocaleString()} renders
                  </p>
                </div>
              </div>

              {budget && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    Budget: {budget.threshold}ms
                    {isOverBudget && (
                      <span className="ml-2 text-red-600">
                        (Exceeded by {(metrics.averageRenderTime - budget.threshold).toFixed(2)}ms)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
