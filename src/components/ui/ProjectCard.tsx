import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

interface ProjectCardProps {
  title?: string;
  category?: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  project?: {
    id: number;
    title: string;
    category: string;
    short_description: string;
    image_url: string;
    location?: string;
    completion_date?: string;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  category, 
  description, 
  image,
  onClick,
  project
}) => {
  // If project prop is provided, use it (for recent projects showcase)
  if (project) {
    const getCategoryIcon = (cat: string) => {
      switch(cat) {
        case 'handyman': return '🔧';
        case 'remodeling': return '🏗️';
        case 'additions': return '➕';
        default: return '🏠';
      }
    };

    const getCategoryName = (cat: string) => {
      switch(cat) {
        case 'handyman': return 'Handyman Services';
        case 'remodeling': return 'Remodeling';
        case 'additions': return 'Additions';
        default: return 'General';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-6xl">{getCategoryIcon(project.category)}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
              {getCategoryIcon(project.category)} {getCategoryName(project.category)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
            {project.title}
          </h3>
          
          {project.short_description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {project.short_description}
            </p>
          )}

          <div className="flex justify-between items-center text-sm text-gray-500">
            {project.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{project.location}</span>
              </div>
            )}
            {project.completion_date && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{new Date(project.completion_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, use old props (for backward compatibility)
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
