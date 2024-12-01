import React from 'react';
import { Toaster } from 'sonner';
import Navigation from './Navigation';
import OfflineIndicator from './OfflineIndicator';
import { usePreloadComponents } from '@core/hooks/usePreloadComponents';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Use the preload hook to intelligently preload components
  usePreloadComponents();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="top-right" />
      <OfflineIndicator />
    </div>
  );
};
