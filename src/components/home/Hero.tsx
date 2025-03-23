
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/classUtils';
import { Button } from '@/components/ui/button';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import Link from 'next/link';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section 
      className={cn(
        "relative overflow-hidden bg-secondary md:py-32",
        className
      )}
    >
      <div className="absolute opacity-0 inset-0 z-0 opacit">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23176D45' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }} />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6 mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full font-medium text-sm animate-fade-in">
                Empowering Agriculture
              </div>
              
              <h1 className="font-bold tracking-tight">
                Cultivate Success with Premium Agricultural Solutions
              </h1>
              
              <p className="text-muted-foreground text-lg">
                Discover top-quality agricultural products, expert knowledge, and innovative 
                solutions for farmers and gardening enthusiasts of all levels.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/shop" className="flex items-center">
                    Shop Now
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-muted">
              <PlaceholderImage 
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8"
                alt="Farmer inspecting crops"
                className="w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-border animate-fade-in">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                      <line x1="6" x2="18" y1="17" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Organic Farming</div>
                    <div className="text-sm text-muted-foreground">Best practices</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-border animate-fade-in animation-delay-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0"></path>
                      <path d="M12 2v4"></path>
                      <path d="M12 18v4"></path>
                      <path d="M4.93 4.93l2.83 2.83"></path>
                      <path d="M16.24 16.24l2.83 2.83"></path>
                      <path d="M2 12h4"></path>
                      <path d="M18 12h4"></path>
                      <path d="M4.93 19.07l2.83-2.83"></path>
                      <path d="M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Sustainable</div>
                    <div className="text-sm text-muted-foreground">Eco friendly products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;