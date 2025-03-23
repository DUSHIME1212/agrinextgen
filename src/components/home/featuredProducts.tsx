"use client"

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/classUtils';
import { Button } from '@/components/ui/button';
import ProductCard from '../shop/ProductCard';
import Link from 'next/link';
import ProductQuickView from '../shop/ProductQuickView';

interface FeaturedProductsProps {
  className?: string;
}


const featuredProducts = [
  {
    id: "1",
    name: "Organic Tomato Seeds",
    price: 4.99,
    image: "https://i.pinimg.com/736x/47/3c/e5/473ce5707adb20087225b148a810d755.jpg",
    images: [
      "https://images.unsplash.com/photo-1592921870789-04563d55041c",
      "https://images.unsplash.com/photo-1607305387299-a3d9611cd469",
    ],
    category: "Seeds",
    description: "Premium quality organic tomato seeds that produce juicy, flavorful tomatoes. These heirloom variety seeds are non-GMO and perfect for home gardens.",
    isNew: true,
    rating: 4.8,
    variants: [
      {
        name: "Package Size",
        options: ["Small Pack", "Medium Pack", "Large Pack"],
      },
    ],
  },
  {
    id: "2",
    name: "Heavy-Duty Garden Shears",
    price: 24.95,
    image: "https://i.pinimg.com/736x/68/0e/9f/680e9f0a7310d3be7ce29c5fba47e86f.jpg",
    images: [
      "https://images.unsplash.com/photo-1585513553738-84dae37a6ccc",
      "https://images.unsplash.com/photo-1638864616275-9f0b348adb4a",
    ],
    category: "Equipment",
    description: "Professional-grade garden shears with ergonomic handles and stainless steel blades. Perfect for pruning, trimming, and harvesting.",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Organic Compost - 5kg Bag",
    price: 19.99,
    image: "https://i.pinimg.com/736x/70/3c/ec/703cec6cf5253c322d007af0b92c7cc2.jpg",
    images: [
      "https://images.unsplash.com/photo-1628532197375-82e27629d5df",
      "https://images.unsplash.com/photo-1580594193369-0db080e0e085",
    ],
    category: "Fertilizers",
    description: "Premium organic compost made from plant waste and beneficial microorganisms. Improves soil structure, adds nutrients, and promotes healthy plant growth.",
    isSale: true,
    discount: 15,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Advanced Drip Irrigation Kit",
    price: 59.99,
    image: "https://i.pinimg.com/474x/21/77/fa/2177fa4c4bdb9f5465f42c87ab4d0aa0.jpg",
    images: [
      "https://i.pinimg.com/474x/9d/e2/66/9de2663dfbce24b413184d3603df3c29.jpg",
      "https://i.pinimg.com/474x/21/77/fa/2177fa4c4bdb9f5465f42c87ab4d0aa0.jpg",
    ],
    category: "Irrigation",
    description: "Complete drip irrigation system for efficient watering. Includes tubing, emitters, connectors, and timer. Easy to install and water-saving.",
    rating: 4.7,
    variants: [
      {
        name: "Coverage Area",
        options: ["Small Garden", "Medium Garden", "Large Garden"],
      },
    ],
  },
];

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ className }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<typeof featuredProducts[0] | null>(null);
  
  const handleQuickView = (product: typeof featuredProducts[0]) => {
    setQuickViewProduct(product);
  };
  
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-xl">
              Discover our handpicked selection of premium agricultural products to help you 
              grow better, harvest more, and farm smarter.
            </p>
          </div>
          
          <Link 
            href="/shop" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-4 md:mt-0"
          >
            View All Products 
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isSale={product.isSale}
              discount={product.discount}
              rating={product.rating}
              onQuickView={() => handleQuickView(product)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/shop">
              Browse All Products
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
      
      {quickViewProduct && (
        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;