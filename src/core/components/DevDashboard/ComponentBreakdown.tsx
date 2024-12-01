import React from 'react';
import { muiPerformanceMonitor } from '../../monitoring/materialUI';

export const ComponentBreakdown: React.FC = () => {
  const report = muiPerformanceMonitor.getPerformanceReport();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">Slowest Components</h3>
        <div className="space-y-2">
          {report.slowestComponents.map(({ name, averageRenderTime }) => (
            <div key={name} className="flex justify-between items-center">
              <span className="text-gray-700">{name}</span>
              <div className="flex items-center">
                <div 
                  className="h-2 bg-red-200 rounded"
                  style={{ 
                    width: `${Math.min(averageRenderTime * 2, 100)}px`,
                    backgroundColor: averageRenderTime > 16 ? '#FCA5A5' : '#86EFAC'
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {averageRenderTime.toFixed(2)}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">Highest Memory Usage</h3>
        <div className="space-y-2">
          {report.highestMemoryUsage.map(({ name, peakMemoryUsage }) => (
            <div key={name} className="flex justify-between items-center">
              <span className="text-gray-700">{name}</span>
              <div className="flex items-center">
                <div 
                  className="h-2 bg-blue-200 rounded"
                  style={{ 
                    width: `${Math.min((peakMemoryUsage / (1024 * 1024)), 100)}px`
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {(peakMemoryUsage / (1024 * 1024)).toFixed(2)}MB
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        * Target render time: 16ms (60fps)
      </div>
    </div>
  );
};
