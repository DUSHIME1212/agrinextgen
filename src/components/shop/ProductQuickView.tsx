"use client"

import { Check, Heart, Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib";
import { Badge } from "../ui/badge";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

interface ProductQuickViewProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      category: string;
      description: string;
      isNew?: boolean;
      isSale?: boolean;
      isOutOfStock?: boolean;
      discount?: number;
      rating?: number;
      slug?:string;
      variants?: Array<{
        name: string;
        options: string[];
      }>;
    };
  }
  
  const ProductQuickView: React.FC<ProductQuickViewProps> = ({
    isOpen,
    onClose,
    product,
  }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(product.price);
    
    const formattedDiscountPrice = product.discount
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(product.price - (product.price * product.discount) / 100)
      : null;
    
    const handleQuantityChange = (amount: number) => {
      const newQuantity = quantity + amount;
      if (newQuantity > 0) {
        setQuantity(newQuantity);
      }
    };
    
    const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants((prev: Record<string, string>) => ({
      ...prev,
      [variantName]: option,
    }));
    };
    
    const handleAddToCart = () => {
      if (product.isOutOfStock) return;
      
      setIsAddingToCart(true);
      
      // Simulate adding to cart
      setTimeout(() => {
        setIsAddingToCart(false);
        toast(`${product.name} has been added to your cart.`);
      }, 600);
    };
    
    const handleToggleWishlist = () => {
      setIsWishlisted(!isWishlisted);
      
      toast(
        isWishlisted
          ? `${product.name} has been removed from your wishlist.`
          : `${product.name} has been added to your wishlist.`
      );
    };
    
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="bg-muted p-6 flex flex-col">
              <div className="relative aspect-square bg-background rounded-md overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-primary text-white">New</Badge>
                  )}
                  
                  {product.isSale && (
                    <Badge className="bg-destructive text-white">Sale</Badge>
                  )}
                  
                  {product.isOutOfStock && (
                    <Badge variant="secondary" className="bg-muted text-foreground">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      )}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="p-6 relative">
              <DialogClose className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X size={24} />
              </DialogClose>
              
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">
                  {product.category}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                
                <div className="flex items-center gap-2 mb-4">
                  {product.discount ? (
                    <>
                      <span className="font-semibold text-xl">
                        {formattedDiscountPrice}
                      </span>
                      <span className="text-muted-foreground line-through">
                        {formattedPrice}
                      </span>
                      <Badge className="bg-destructive text-white ml-2">
                        {product.discount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="font-semibold text-xl">{formattedPrice}</span>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <h4 className="font-medium mb-2">
                        {variant.name}:{" "}
                        <span className="text-primary">
                          {selectedVariants[variant.name] || "Select an option"}
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleVariantChange(variant.name, option)}
                            className={cn(
                              "px-3 py-1 border rounded-md transition-all",
                              selectedVariants[variant.name] === option
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium mb-2">Quantity</h4>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </Button>
                  <div className="h-10 px-4 flex items-center justify-center border-y border-input">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Button
                  className="flex-1"
                  size="lg"
                  disabled={product.isOutOfStock || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Check size={18} className="mr-2 animate-scale-in" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-12 w-12",
                    isWishlisted && "text-primary border-primary"
                  )}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "fill-primary" : ""}
                  />
                </Button>
              </div>
              
              <div className="text-center">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-primary font-medium hover:underline"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ProductQuickView;