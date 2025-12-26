import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image?: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  category, 
  description, 
  image,
  onClick 
}) => {
  return (
    <Card hover onClick={onClick} className="overflow-hidden h-full flex flex-col" padding="none">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl text-blue-300">🏗️</div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <Badge variant="blue">{category}</Badge>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </Card>
  );
};
