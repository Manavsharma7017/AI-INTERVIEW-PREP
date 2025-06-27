import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    easy: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-300',
    medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300',
    hard: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-300',
    success: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-300',
    warning: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300',
    danger: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-300',
    info: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-300',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        whitespace-nowrap transition-colors duration-200 ease-in-out
        ${variantClasses[variant]} ${className}
      `}
      role="status"
      aria-label={`Badge: ${typeof children === 'string' ? children : 'info'}`}
    >
      {children}
    </span>
  );
};
