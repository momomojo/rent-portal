import React from 'react';
import { Select, SelectProps } from './Select';

export interface SelectNewProps extends SelectProps {
  // Additional props specific to SelectNew
  loading?: boolean;
  helperText?: string;
}

export const SelectNew = React.forwardRef<HTMLSelectElement, SelectNewProps>(
  ({ loading, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <Select
          ref={ref}
          className={`
            ${loading ? 'cursor-wait opacity-70' : ''}
            ${className}
          `}
          disabled={loading || props.disabled}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-sm ${props.error ? 'text-red-500' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectNew.displayName = 'SelectNew';
