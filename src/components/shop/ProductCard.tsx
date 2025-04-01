"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
import { cn } from "@/lib/classUtils";
import { formatPrice, formatDiscountPrice } from "@/lib/PriceUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Link from "next/link";
import { toast } from "sonner";

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
  slug?: string;
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
  slug,
  onQuickView,
  className,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formattedPrice = formatPrice(price);

  const discountPrices = discount ? formatDiscountPrice(price, discount) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAddingToCart(true);

    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`${name} has been added to your cart.`);
    }, 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlisted(!isWishlisted);

    toast(
      isWishlisted
        ? `${name} has been removed from your wishlist.`
        : `${name} has been added to your wishlist.`,
    );
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
        "card product-card group flex flex-col relative p-4 overflow-clip text-primary-foreground transition-all duration-300 hover:translate-y-[-5px]",
        isOutOfStock && "opacity-70",
        className,
      )}
    >
      
      {/* Status badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-primary text-primary-foreground">New</Badge>
        )}

        {isSale && (
          <Badge className="bg-destructive text-primary-foreground">Sale</Badge>
        )}

        {isOutOfStock && (
          <Badge variant="secondary" className="bg-muted text-foreground">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product image */}
      <div className="min-h-72 overflow-clip">
        <PlaceholderImage
          src={image}
          alt={name}
          className="h-72 w-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick actions */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex translate-y-4 transform gap-2 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={handleQuickView}
              title="Quick view"
            >
              <Eye size={18} />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full bg-primary text-primary-foreground shadow-md transition-colors",
                isWishlisted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-primary hover:text-primary-foreground",
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
                "rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary hover:text-white",
                isAddingToCart && "bg-primary text-white",
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
      <Link href={`/product/${slug}`} className="block ">
        <div className="mb-1 text-sm text-muted-foreground">{category}</div>
        <h3 className="mb-2 line-clamp-2 min-h-20 font-medium transition-colors text-muted-foreground hover:text-primary">
          {name}
        </h3>

        

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountPrices ? (
              <>
                <span className="font-semibold">
                  {discountPrices.discounted}
                </span>
                <span className="text-sm text-muted-foreground line-through">
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
      <Button asChild className="z-20 cursor-pointer text-center">
        <Link
          href={`/shop/${slug}`}
          className="font-medium  hover:underline"
        >
          View Full Details
        </Link>
      </Button>
    </div>
  );
};

export default ProductCard;
