import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div onClick={onClick} className={`bg-white rounded-xl shadow-md transition-all duration-200 ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};
