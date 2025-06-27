import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-white/20
        p-4 sm:p-6
        transition-all duration-300 ease-in-out
        ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
