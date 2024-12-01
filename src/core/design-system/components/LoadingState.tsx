import React from 'react';
import { tokens } from '../tokens';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingStateVariants = cva(
  'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700',
  {
    variants: {
      size: {
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-8',
        xl: 'h-10',
      },
      width: {
        full: 'w-full',
        half: 'w-1/2',
        third: 'w-1/3',
        quarter: 'w-1/4',
      },
    },
    defaultVariants: {
      size: 'md',
      width: 'full',
    },
  }
);

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingStateVariants> {
  repeat?: number;
  gap?: keyof typeof tokens.spacing;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size,
  width,
  repeat = 1,
  gap = 4,
  className,
  ...props
}) => {
  return (
    <div className={`space-y-${gap}`} role="status" aria-label="Loading...">
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className={loadingStateVariants({ size, width, className })}
          {...props}
        />
      ))}
    </div>
  );
};

// Example usage:
/*
  <LoadingState size="md" width="full" repeat={3} gap={4} />
*/
