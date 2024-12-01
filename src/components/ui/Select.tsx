import { ChevronDown } from 'lucide-react';
import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={`
            block w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm
            shadow-sm transition-colors
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500'
              : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            }
            ${props.disabled ? 'cursor-not-allowed bg-gray-50 opacity-50' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
