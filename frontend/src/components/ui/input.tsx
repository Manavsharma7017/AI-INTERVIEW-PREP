import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, className = '', id, ...props },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
