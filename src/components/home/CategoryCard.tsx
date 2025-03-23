
import React from 'react';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { cn } from '@/lib';

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
  className?: string;
}

const categories = [
  {
    title: "Seeds & Plants",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
    description: "Quality seeds and starter plants for all your crop needs",
    link: "/shop"
  },
  {
    title: "Equipment & Tools",
    image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a",
    description: "Essential tools and equipment for modern farming",
    link: "/shop"
  },
  {
    title: "Fertilizers",
    image: "https://i.pinimg.com/736x/b1/f5/4e/b1f54e938786562b23f9e1285e9ae59f.jpg",
    description: "Organic and conventional fertilizers for optimal yields",
    link: "/shop"
  },
  {
    title: "Irrigation Systems",
    image: "https://i.pinimg.com/736x/d8/c8/16/d8c816b5ff7639a28eb414960e7cd95e.jpg",
    description: "Water-efficient irrigation solutions for all farm sizes",
    link: "/shop"
  },
  {
    title: "Organic Products",
    image: "https://i.pinimg.com/736x/d7/ff/45/d7ff45a9a8232ffe35152d9f85f779c1.jpg",
    description: "Certified organic products for sustainable agriculture",
    link: "/shop"
  },
  {
    title: "Livestock Supplies",
    image: "https://i.pinimg.com/736x/5e/04/c5/5e04c56e67057864e723a9ea927ca0ec.jpg",
    description: "Complete range of livestock care and management products",
    link: "/shop"
  }
];

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  description,
  link,
  className,
}) => {
  return (
    <Link 
      href={link}
      className={cn(
        "group block rounded-lg overflow-hidden transition-all duration-300 border border-border hover:shadow-glass hover:border-border relative",
        className
      )}
    >
      <div className="aspect-[3/2] bg-cover bg-center relative">
        <PlaceholderImage 
          src={image}
          alt={title}
          className="h-72 w-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity group-hover:opacity-80" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-foreground transition-colors">
          {title}
        </h3>
        <p className="text-white/80 text-sm mb-3 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity">
          {description}
        </p>
        <span className="inline-block text-sm font-medium transition-all transform translate-x-0 group-hover:translate-x-2">
          Browse Products →
        </span>
      </div>
    </Link>
  );
};

interface CategoriesProps {
  className?: string;
}

const Categories: React.FC<CategoriesProps> = ({ className }) => {
  return (
    <section className={cn("py-16 md:py-24 bg-secondary", className)}>
      <div className="container">
        <div className="t mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-xl ">
            Explore our specialized product categories designed to meet all your 
            agricultural and farming needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              description={category.description}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;