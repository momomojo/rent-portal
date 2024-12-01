import React from 'react';
import { DashboardConfig } from '../config/DashboardConfig';

export type DashboardSize = 'small' | 'medium' | 'large' | 'full';

interface DashboardLayoutProps {
  size: DashboardSize;
  activeView: string;
  onViewChange: (view: string) => void;
  onSizeChange: (size: DashboardSize) => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<DashboardSize, string> = {
  small: 'w-96 h-96',
  medium: 'w-[600px] h-[450px]',
  large: 'w-[800px] h-[600px]',
  full: 'w-screen h-screen'
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  size,
  activeView,
  onViewChange,
  onSizeChange,
  isExpanded,
  onExpandToggle,
  children
}) => {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`fixed bottom-0 right-0 bg-white shadow-lg rounded-tl-lg transition-all duration-300 ${
        isExpanded ? sizeClass : 'w-48 h-12'
      }`}
    >
      <DashboardConfig
        size={size}
        activeView={activeView}
        onViewChange={onViewChange}
        onSizeChange={onSizeChange}
        isExpanded={isExpanded}
        onExpandToggle={onExpandToggle}
      />
      {isExpanded && (
        <div className="h-[calc(100%-3rem)] overflow-auto">
          <div className="p-4 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
