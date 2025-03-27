
// This file is now a wrapper around the shadcn/ui breadcrumb component
// to maintain backward compatibility with aRW code that might be using it

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Breadcrumb as BreadcrumbRoot, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BreadcrumbProps {
  customPaths?: { name: string; path: string }[];
  className?: string;
}

const BreadcrumbWrapper: React.FC<BreadcrumbProps> = ({ customPaths, className }) => {
  const location = usePathname();
  const pathnames = location.split('/').filter((x) => x);
  
  // Generate paths based on current URL or use custom paths if provided
  const breadcrumbPaths = customPaths ?? pathnames.map((path, index) => {
    const url = `/${pathnames.slice(0, index + 1).join('/')}`;
    
    // Format path name
    let name = path.replace(/-/g, ' ');
    
    // Check if path contains ID pattern or slug
    if (/^[0-9a-fA-F-]+$/.test(path) || path.includes('-')) {
      // Look for a title in the state, or use a generic name
      name = 'Details';
    }
    
    return { name: name.charAt(0).toUpperCase() + name.slice(1), path: url };
  });

  return (
    <BreadcrumbRoot className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-200">
              <Home size={16} className="mr-1" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbPaths.map((item, index) => {
          const isLast = index === breadcrumbPaths.length - 1;
          
          return (
            <React.Fragment key={item.path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.path} className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      {item.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

export default BreadcrumbWrapper;