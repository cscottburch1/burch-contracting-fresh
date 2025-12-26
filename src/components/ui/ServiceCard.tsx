'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Adjust path if needed
import { Icon } from '@/components/ui/Icon'; // Adjust path if needed

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  compact?: boolean;  // <-- Add this line
}

export const ServiceCard = ({
  title,
  description,
  icon,
  href = '/contact',
  className = '',
  compact = false,  // <-- Add default value
}: ServiceCardProps) => {
  const content = (
    <div className={`flex flex-col h-full ${compact ? 'p-4' : 'p-8'}`}>
      {icon && <div className={`mb-6 text-blue-600 ${compact ? 'text-3xl' : 'text-4xl'}`}>{icon}</div>}
      <h3 className={`font-bold mb-3 text-gray-900 ${compact ? 'text-xl' : 'text-2xl'}`}>{title}</h3>
      <p className={`text-gray-600 flex-grow mb-6 ${compact ? 'text-sm' : ''}`}>{description}</p>
      <div className="mt-auto">
        <Button variant="primary" size={compact ? 'sm' : 'lg'} href={href}>
          Learn More
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${compact ? 'p-4' : 'p-8'} ${className}`}>
      {href ? (
        <a href={href} className="block h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};