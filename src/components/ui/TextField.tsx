import React from 'react';
import { cn } from '@/lib/utils';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    fullWidth,
    variant = 'outlined',
    startAdornment,
    endAdornment,
    ...props
  }, ref) => {
    const inputClasses = cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-red-500 focus-visible:ring-red-500',
      fullWidth && 'w-full',
      variant === 'filled' && 'bg-muted',
      className
    );

    const wrapperClasses = cn(
      'relative',
      fullWidth && 'w-full'
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            style={{
              paddingLeft: startAdornment ? '2.5rem' : undefined,
              paddingRight: endAdornment ? '2.5rem' : undefined,
            }}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {endAdornment}
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-red-500' : 'text-gray-500'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
