import React from 'react';
import * as Icons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ name, size = 24, className = '' }: WeatherIconProps) {
  // Resolve icon component from lucide-react dynamically
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Fallback icon
    return <Icons.Cloud size={size} className={className} />;
  }
  
  return <IconComponent size={size} className={className} />;
}
