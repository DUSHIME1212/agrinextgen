"use client"

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BreadcrumbWrapper from '@/components/ui/BreadcrumbWrapper';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  customBreadcrumbPaths?: { name: string; path: string }[];
  fullWidth?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showBreadcrumb = true,
  customBreadcrumbPaths,
  fullWidth = false,
  className,
}) => {
  const location = usePathname();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const shouldShowBreadcrumb = showBreadcrumb && location !== '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className={cn("flex-grow px-8 md:px-16 pt-[76px]", className)}>
        {shouldShowBreadcrumb && (
          <div className="bg-secondary border-y border-border">
            <div className={fullWidth ? "container-custom" : "container-custom max-w-5xl"}>
              <BreadcrumbWrapper 
                className="py-3" 
                customPaths={customBreadcrumbPaths} 
              />
            </div>
          </div>
        )}
        
        <div className={cn("animate-fade-in", fullWidth ? "" : "container-custom")}>
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;