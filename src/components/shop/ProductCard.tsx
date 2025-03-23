"use client"

import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { cn } from '@/lib/classUtils';
import { formatPrice, formatDiscountPrice } from '@/lib/PriceUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  isOutOfStock?: boolean;
  discount?: number;
  rating?: number;
  onQuickView?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  isSale = false,
  isOutOfStock = false,
  discount,
  rating,
  onQuickView,
  className,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const formattedPrice = formatPrice(price);
  
  const discountPrices = discount 
    ? formatDiscountPrice(price, discount)
    : null;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`${name} has been added to your cart.`);
    }, 600);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(!isWishlisted);
    
    toast(isWishlisted
      ? `${name} has been removed from your wishlist.`
      : `${name} has been added to your wishlist.`);
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onQuickView) {
      onQuickView();
    }
  };
  
  return (
    <div 
      className={cn(
        "card group product-card relative transition-all overflow-clip duration-300 hover:translate-y-[-5px]",
        isOutOfStock && "opacity-70",
        className
      )}
    >
      {/* Status badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-primary text-white">New</Badge>
        )}
        
        {isSale && (
          <Badge className="bg-destructive text-white">Sale</Badge>
        )}
        
        {isOutOfStock && (
          <Badge variant="secondary" className="bg-muted text-foreground">
            Out of Stock
          </Badge>
        )}
      </div>
      
      {/* Product image */}
      <div className="product-image">
        <PlaceholderImage
          src={image}
          alt={name}
          className="h-72 w-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-md bg-white hover:bg-primary hover:text-white transition-colors"
              onClick={handleQuickView}
              title="Quick view"
            >
              <Eye size={18} />
            </Button>
            
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full shadow-md bg-white transition-colors",
                isWishlisted
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "hover:bg-primary hover:text-white"
              )}
              onClick={handleToggleWishlist}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
            </Button>
            
            <Button
              size="icon"
              variant="secondary"
              disabled={isOutOfStock || isAddingToCart}
              className={cn(
                "rounded-full shadow-md bg-white hover:bg-primary hover:text-white transition-colors",
                isAddingToCart && "bg-primary text-white"
              )}
              onClick={handleAddToCart}
              title="Add to cart"
            >
              {isAddingToCart ? (
                <Check size={18} className="animate-scale-in" />
              ) : (
                <ShoppingCart size={18} />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product details */}
      <Link href={`/product/${id}`} className="block p-4">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <h3 className="font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountPrices ? (
              <>
                <span className="font-semibold">{discountPrices.discounted}</span>
                <span className="text-muted-foreground line-through text-sm">
                  {discountPrices.original}
                </span>
              </>
            ) : (
              <span className="font-semibold">{formattedPrice}</span>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center">
              {/* Star rating would go here */}
              <span className="text-sm text-muted-foreground">{rating}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
