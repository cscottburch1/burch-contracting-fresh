'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Adjust path if needed
import { Icon } from '@/components/ui/Icon'; // Adjust path if needed

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // For custom icons (e.g., Lucide or SVG)
  href?: string; // Optional link
  className?: string;
}

export const ServiceCard = ({
  title,
  description,
  icon,
  href = '/contact',
  className = '',
}: ServiceCardProps) => {
  const content = (
    <div className="flex flex-col h-full">
      {icon && <div className="mb-6 text-blue-600">{icon}</div>}
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 flex-grow mb-6">{description}</p>
      <div className="mt-auto">
        <Button variant="primary" size="lg" href={href}>
          Learn More
        </Button>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
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