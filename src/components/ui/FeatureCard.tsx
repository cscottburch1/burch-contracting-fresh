import React from 'react';
import { Card } from './Card';
import Icon, { IconName } from './Icon';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconName;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="text-center h-full">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name={icon} className="text-white" size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};