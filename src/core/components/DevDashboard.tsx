import React, { useState } from 'react';
import { usePerformanceMetrics } from '@/core/hooks/usePerformanceMetrics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Typography } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { PerformanceView, MemoryView, NetworkView, ComponentsView } from './DevDashboard/views';

type ViewType = 'performance' | 'memory' | 'network' | 'components';
type DashboardSize = 'small' | 'medium' | 'large' | 'full';

const DASHBOARD_SIZES = {
  small: { width: 'w-96', height: 'h-64' },
  medium: { width: 'w-[32rem]', height: 'h-96' },
  large: { width: 'w-[48rem]', height: 'h-[32rem]' },
  full: { width: 'w-screen', height: 'h-screen' }
};

export const DevDashboard: React.FC = () => {
  const { metrics } = usePerformanceMetrics();
  const [selectedView, setSelectedView] = useState<ViewType>('performance');
  const [isExpanded, setIsExpanded] = useState(false);
  const [dashboardSize, setDashboardSize] = useState<DashboardSize>('medium');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const { width, height } = DASHBOARD_SIZES[dashboardSize];

  return (
    <Card className={cn(
      "fixed bottom-0 right-0 transition-all duration-300",
      isExpanded ? `${width} ${height}` : 'w-48 h-12'
    )}>
      <div className="p-2 border-b flex justify-between items-center">
        <Typography variant="h6" className="text-sm">
          Performance Metrics
        </Typography>
        <div className="flex items-center space-x-2">
          {isExpanded && (
            <Select value={dashboardSize} onValueChange={(value: DashboardSize) => setDashboardSize(value)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="full">Full Screen</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? '▼' : '▲'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 h-[calc(100%-3rem)] overflow-auto">
          <div className="flex space-x-4 mb-4">
            <Select value={selectedView} onValueChange={(value: ViewType) => setSelectedView(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="memory">Memory Usage</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="components">Component Breakdown</SelectItem>
              </SelectContent>
            </Select>
            {selectedView === 'performance' && (
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  {Array.from(new Set(metrics.map(d => d.name))).map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="h-[calc(100%-3rem)]">
            {selectedView === 'performance' && (
              <PerformanceView
                selectedMetric={selectedMetric}
                data={metrics}
              />
            )}
            {selectedView === 'memory' && <MemoryView />}
            {selectedView === 'network' && <NetworkView />}
            {selectedView === 'components' && <ComponentsView />}
          </div>
        </div>
      )}
    </Card>
  );
};
