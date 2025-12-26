import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const backgroundStyles = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  blue: 'bg-blue-50',
  dark: 'bg-gray-900 text-white'
};

const paddingStyles = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32'
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'white',
  padding = 'lg'
}) => {
  return (
    <section className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};
