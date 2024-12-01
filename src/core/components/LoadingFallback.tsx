import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  className,
  size = 'md',
  centered = true,
}) => {
  const containerClasses = cn(
    'flex items-center',
    centered && 'justify-center min-h-[200px]',
    className
  );

  const spinnerClasses = cn(
    'animate-spin rounded-full border-b-2 border-primary',
    sizeClasses[size]
  );

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} />
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        className
      )}
    />
  );
};
