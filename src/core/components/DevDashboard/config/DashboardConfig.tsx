import React from 'react';
import { DashboardSize } from '../layout/DashboardLayout';

interface DashboardConfigProps {
  size: DashboardSize;
  activeView: string;
  onViewChange: (view: string) => void;
  onSizeChange: (size: DashboardSize) => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

export const DashboardConfig: React.FC<DashboardConfigProps> = ({
  size,
  activeView,
  onViewChange,
  onSizeChange,
  isExpanded,
  onExpandToggle
}) => {
  return (
    <div className="border-b p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Performance Dashboard</h2>
        <div className="flex items-center space-x-2">
          {isExpanded && (
            <>
              <ViewSelector value={activeView} onChange={onViewChange} />
              <SizeSelector value={size} onChange={onSizeChange} />
            </>
          )}
          <button
            onClick={onExpandToggle}
            className="text-gray-600 hover:text-gray-800 p-1"
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SelectorProps {
  value: string;
  onChange: (value: any) => void;
}

const ViewSelector: React.FC<SelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-xs p-1 border rounded"
  >
    <option value="performance">Performance</option>
    <option value="memory">Memory Usage</option>
    <option value="network">Network</option>
    <option value="components">Components</option>
    <option value="budgets">Budgets</option>
  </select>
);

const SizeSelector: React.FC<SelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-xs p-1 border rounded"
  >
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
    <option value="full">Full Screen</option>
  </select>
);
