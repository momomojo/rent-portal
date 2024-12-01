import React from 'react';
import { Skeleton } from '@mui/material';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" width={200} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton variant="rectangular" height={200} className="mb-4" />
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingFallback;
