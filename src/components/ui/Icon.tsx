import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', strokeWidth = 2 }) => {
  const LucideIcon = LucideIcons[name] as React.ComponentType<any>;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return React.createElement(LucideIcon, { size, className, strokeWidth, 'aria-hidden': 'true' });
};

export default Icon;
export { Icon };