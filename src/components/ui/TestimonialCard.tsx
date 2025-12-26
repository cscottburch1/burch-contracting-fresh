import React from 'react';
import { Card } from './Card';
import Icon from './Icon';
import { Badge } from './Badge';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  project: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  location, 
  text, 
  rating, 
  project 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Icon key={i} name="Star" className="text-yellow-400 fill-current" size={18} />
        ))}
      </div>
      <p className="text-gray-700 mb-6 flex-grow italic">"{text}"</p>
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <Badge variant="blue">{project}</Badge>
        </div>
      </div>
    </Card>
  );
};