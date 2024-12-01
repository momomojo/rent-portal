import React from 'react';

const AppPreloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <div className="text-lg font-medium text-gray-700">Loading Rent Portal...</div>
        <div className="text-sm text-gray-500">Please wait while we set things up</div>
      </div>
    </div>
  );
};

export default AppPreloader;
