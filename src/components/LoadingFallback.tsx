import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  fullScreen?: boolean;
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  fullScreen = false,
  className
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen ? 'min-h-screen' : 'min-h-[200px]',
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
};

export const PageLoadingFallback = () => (
  <div className="p-8">
    <div className="space-y-8">
      <Skeleton className="h-8 w-[250px]" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>
  </div>
);