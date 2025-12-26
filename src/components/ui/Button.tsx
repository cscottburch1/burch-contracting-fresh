import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
  secondary: 'bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-blue-600 hover:bg-blue-50'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
};
