import React from 'react';
import { Button, ButtonProps } from './Button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative',
          loading && 'text-transparent transition-colors',
          className
        )}
        {...props}
      >
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-current" />
          </div>
        )}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
