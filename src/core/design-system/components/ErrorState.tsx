import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const errorStateVariants = cva(
  'rounded-lg p-4 flex items-start gap-3',
  {
    variants: {
      variant: {
        error: 'bg-error-50 text-error-700',
        warning: 'bg-warning-50 text-warning-700',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'error',
      size: 'md',
    },
  }
);

export interface ErrorStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorStateVariants> {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant,
  size,
  title,
  message,
  action,
  className,
  ...props
}) => {
  const Icon = variant === 'error' ? XCircleIcon : ExclamationTriangleIcon;

  return (
    <div
      className={errorStateVariants({ variant, size, className })}
      role="alert"
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && (
          <h3 className="font-semibold">
            {title}
          </h3>
        )}
        <div className={title ? 'mt-1' : ''}>
          {message}
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-3 text-sm font-medium underline hover:text-current/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

// Example usage:
/*
  <ErrorState
    variant="error"
    title="Error loading properties"
    message="There was a problem loading the property listings. Please try again."
    action={{
      label: "Retry",
      onClick: () => refetch()
    }}
  />
*/
