
import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  className,
  src,
  alt = "Placeholder image",
  width,
  height,
}) => {
  return (
    <div className={cn("bg-muted relative overflow-hidden", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 16l5-5 5 5" />
            <path d="M16 10l2-2 3 3" />
            <circle cx="16" cy="8" r="2" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default PlaceholderImage;