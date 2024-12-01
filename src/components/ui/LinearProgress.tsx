import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const linearProgressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-primary/20',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
      color: {
        default: '[&>div]:bg-primary',
        primary: '[&>div]:bg-primary',
        secondary: '[&>div]:bg-secondary',
        success: '[&>div]:bg-green-600 dark:[&>div]:bg-green-500',
        error: '[&>div]:bg-red-600 dark:[&>div]:bg-red-500',
        warning: '[&>div]:bg-yellow-600 dark:[&>div]:bg-yellow-500',
        info: '[&>div]:bg-blue-600 dark:[&>div]:bg-blue-500',
      },
      variant: {
        determinate: '',
        indeterminate: '',
        buffer: '',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'default',
      variant: 'determinate',
    },
  }
);

export interface LinearProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof linearProgressVariants> {
  value?: number;
  valueBuffer?: number;
}

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ className, size, color, variant, value, valueBuffer, ...props }, ref) => {
    const isIndeterminate = variant === 'indeterminate';
    const isBuffer = variant === 'buffer';

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={cn(linearProgressVariants({ size, color, variant }), className)}
        {...props}
      >
        {isBuffer && valueBuffer !== undefined && (
          <div
            className="absolute h-full bg-primary/40 transition-all duration-300 ease-in-out"
            style={{ width: `${valueBuffer}%` }}
          />
        )}
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            isIndeterminate &&
              'animate-progress-indeterminate w-[50%] origin-[0%_50%]'
          )}
          style={
            !isIndeterminate
              ? {
                  width: `${value}%`,
                }
              : undefined
          }
        />
      </div>
    );
  }
);

LinearProgress.displayName = 'LinearProgress';
