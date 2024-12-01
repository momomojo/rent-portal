import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const circularProgressVariants = cva(
  'animate-spin rounded-full border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
        xl: 'h-16 w-16 border-4',
      },
      color: {
        default: 'border-primary',
        primary: 'border-primary',
        secondary: 'border-secondary',
        success: 'border-green-600 dark:border-green-500',
        error: 'border-red-600 dark:border-red-500',
        warning: 'border-yellow-600 dark:border-yellow-500',
        info: 'border-blue-600 dark:border-blue-500',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'default',
    },
  }
);

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value?: number;
  thickness?: number;
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className, size, color, value, thickness = 4, ...props }, ref) => {
    const strokeDasharray = 2 * Math.PI * 45; // 45 is the radius
    const strokeDashoffset = strokeDasharray * ((100 - (value || 0)) / 100);

    if (typeof value === 'number') {
      return (
        <div
          ref={ref}
          className={cn('relative inline-flex', className)}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          {...props}
        >
          <svg className={cn(circularProgressVariants({ size, color }))}>
            <circle
              className="stroke-current opacity-25"
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              strokeWidth={thickness}
            />
            <circle
              className="stroke-current"
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              strokeWidth={thickness}
              strokeLinecap="round"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transformOrigin: '50% 50%',
                transform: 'rotate(-90deg)',
              }}
            />
          </svg>
          {value && (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
              {Math.round(value)}%
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="progressbar"
        className={cn(circularProgressVariants({ size, color }), className)}
        {...props}
      />
    );
  }
);

CircularProgress.displayName = 'CircularProgress';
