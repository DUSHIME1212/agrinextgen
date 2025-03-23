"use client"

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Heart, Share2, Check, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import NotFound from '@/app/not-found';

// Agricultural product database
const AGRICULTURAL_PRODUCTS = {
  "product-1": {
    id: 'product-1',
    name: 'Organic Tomato Seeds',
    price: 4.99,
    discount: 0,
    rating: 4.8,
    reviewCount: 127,
    isNew: true,
    isSale: false,
    images: [
      'https://i.pinimg.com/474x/47/3c/e5/473ce5707adb20087225b148a810d755.jpg',
      'https://i.pinimg.com/474x/e7/11/7e/e7117e840b452f6b10568343e21d6722.jpg',
      'https://i.pinimg.com/474x/ee/1d/22/ee1d2286c78ac14efffeb947e077accc.jpg',
      'https://i.pinimg.com/474x/4c/4a/eb/4c4aeb417292c6a288bd69abcac3cec3.jpg',
    ],
    stockStatus: 'In Stock',
    variants: [
      {
        name: 'Package Size',
        options: ['50 Seeds', '100 Seeds', '250 Seeds', '500 Seeds']
      },
      {
        name: 'Variety',
        options: ['Beefsteak', 'Cherry', 'Roma', 'Heirloom Mix']
      }
    ],
    description: 'Our premium organic tomato seeds offer the perfect start to your vegetable garden. These non-GMO, heirloom variety seeds produce juicy, flavorful tomatoes that are packed with nutrients. Each batch is tested for high germination rates to ensure your gardening success.',
    details: [
      'Non-GMO and certified organic',
      'Open-pollinated heirloom varieties',
      'High germination rate (90%+)',
      'Grown and packed in the USA',
      'Ideal for home gardens and small farms',
      'Includes planting instructions',
      'Suitable for container gardening or traditional plots'
    ],
    productInfo: {
      growingSeason: 'Spring, Summer',
      harvestTime: '70-85 days from planting',
      sunExposure: 'Full sun',
      soilRequirements: 'Well-draining, rich in organic matter',
      wateringNeeds: 'Regular, consistent watering',
      plantingDepth: '1/4 inch',
      spacing: '24-36 inches between plants',
      companions: 'Basil, marigolds, carrots, onions'
    },
    additionalInfo: {
      SKU: 'SEED-TOM-ORG-100',
      Category: 'Seeds & Plants',
      Brand: 'GreenThumb Organics',
      Storage: 'Store in cool, dry place away from direct sunlight',
      ShelfLife: '2 years when properly stored',
      Certification: 'USDA Organic, Non-GMO Project Verified'
    },
    reviews: [
      {
        id: 'rev-1',
        user: 'Alex Johnson',
        rating: 5,
        date: '2023-10-15',
        title: 'Excellent germination rate!',
        comment: 'Almost every seed sprouted! I\'m growing these in raised beds and they\'re thriving. The tomatoes are delicious with that real homegrown flavor you can\'t get from store-bought.',
        isVerified: true
      },
      {
        id: 'rev-2',
        user: 'Sam Wilson',
        rating: 4,
        date: '2023-09-22',
        title: 'Great seeds, helpful instructions',
        comment: 'The seeds came with detailed planting instructions which was helpful for a beginner like me. I had about 85% germination which seems good. Plants are growing well now.',
        isVerified: true
      },
      {
        id: 'rev-3',
        user: 'Jamie Lee',
        rating: 5,
        date: '2023-08-30',
        title: 'Best tomatoes I\'ve ever grown',
        comment: 'I\'ve been growing tomatoes for years and these are some of the best seeds I\'ve used. Healthy plants and abundant harvest. Will definitely buy again next season.',
        isVerified: true
      }
    ]
  },
  "product-2": {
    id: 'product-2',
    name: 'Heavy-Duty Garden Shears',
    price: 24.95,
    discount: 10,
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isSale: true,
    images: [
      'https://i.pinimg.com/474x/47/3c/e5/473ce5707adb20087225b148a810d755.jpg',
      'https://i.pinimg.com/474x/e7/11/7e/e7117e840b452f6b10568343e21d6722.jpg',
      'https://i.pinimg.com/474x/ee/1d/22/ee1d2286c78ac14efffeb947e077accc.jpg',
      'https://i.pinimg.com/474x/4c/4a/eb/4c4aeb417292c6a288bd69abcac3cec3.jpg',
    ],
    stockStatus: 'In Stock',
    variants: [
      {
        name: 'Size',
        options: ['8-inch', '9-inch', '10-inch']
      },
      {
        name: 'Handle Color',
        options: ['Red', 'Green', 'Black']
      }
    ],
    description: 'Our premium heavy-duty garden shears are designed for serious gardeners and professional landscapers. Built with high-carbon steel blades and ergonomic handles, these shears make clean cuts through branches up to 3/4 inch thick with minimal effort, reducing hand fatigue during extended use.',
    details: [
      'High-carbon steel blades for lasting sharpness',
      'Ergonomic non-slip handles with cushioned grip',
      'Precision-ground cutting edges',
      'Sap groove prevents blade sticking',
      'Adjustable blade tension',
      'Shock-absorbing bumper',
      'Safety lock mechanism for storage'
    ],
    productInfo: {
      materialBlade: 'High-carbon SK5 steel',
      materialHandle: 'TPR coated aluminum',
      bladeLength: '3 inches',
      totalLength: '8-10 inches (depending on size)',
      weight: '8.5-10.2 oz (depending on size)',
      maintenance: 'Wipe clean, oil occasionally',
      maxCuttingDiameter: '3/4 inch'
    },
    additionalInfo: {
      SKU: 'TOOL-SHEAR-HD',
      Category: 'Equipment & Tools',
      Brand: 'GardenPro',
      Warranty: '5-year manufacturer warranty',
      Origin: 'Made in Taiwan',
      Includes: 'Blade cover, cleaning cloth'
    },
    reviews: [
      {
        id: 'rev-1',
        user: 'Morgan Smith',
        rating: 5,
        date: '2023-10-05',
        title: 'Professional quality at a reasonable price',
        comment: 'I\'m a professional landscaper and these shears have held up well to daily use. The blades stay sharp and the ergonomic handles really do reduce fatigue.',
        isVerified: true
      },
      {
        id: 'rev-2',
        user: 'Taylor Reed',
        rating: 4,
        date: '2023-09-12',
        title: 'Solid construction, good for tough jobs',
        comment: 'These shears cut through woody stems like butter. Very comfortable to use and the locking mechanism works well. Took away one star because they\'re a bit heavy for extended use.',
        isVerified: true
      },
      {
        id: 'rev-3',
        user: 'Casey Johnson',
        rating: 5,
        date: '2023-08-20',
        title: 'Perfect for my rose bushes',
        comment: 'I\'ve been looking for good quality shears that can handle my thorny rose bushes and these are perfect. Clean cuts every time and no hand strain.',
        isVerified: false
      }
    ]
  }
};

const Page: React.FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<typeof AGRICULTURAL_PRODUCTS[keyof typeof AGRICULTURAL_PRODUCTS] | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    // In a real application, this would be an API call
    if (productId && AGRICULTURAL_PRODUCTS[productId as keyof typeof AGRICULTURAL_PRODUCTS]) {
      setProduct(AGRICULTURAL_PRODUCTS[productId as keyof typeof AGRICULTURAL_PRODUCTS]);
      // Reset state when product changes
      setMainImage(0);
      setSelectedVariants({});
      setQuantity(1);
      setIsWishlisted(false);
    }
  }, [productId]);
  
  if (!product) {
    return (
      <NotFound/>
    );
  }
  
  // Calculate discounted price
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;
  
  const formattedOriginalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price);
  
  const formattedDiscountedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(discountedPrice);
  
  const handleAddToCart = () => {
    if (product.variants && !product.variants.every(variant => selectedVariants[variant.name])) {
      toast.error("You need to select all product options before adding to cart");
      return;
    }
    
    toast.success(`${product.name} has been added to your cart`);
  };
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    
    setQuantity(newQuantity);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(
      isWishlisted 
        ? `${product.name} has been removed from your wishlist` 
        : `${product.name} has been added to your wishlist`
    );
  };
  
  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.name, path: `/product/${productId}` }
      ]}
      fullWidth
      className='flex flex-col gap-4'
    >
      <div className="container  px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
              <img 
                src={product.images[mainImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              
              {/* Product badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-primary text-white">New</Badge>
                )}
                {product.isSale && (
                  <Badge className="bg-destructive text-white">Sale</Badge>
                )}
              </div>
            </div>
            
            {/* Thumbnail images */}
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    mainImage === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover object-center" 
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                {product.discount ? (
                  <>
                    <span className="text-2xl font-semibold">{formattedDiscountedPrice}</span>
                    <span className="text-muted-foreground line-through">{formattedOriginalPrice}</span>
                    <Badge className="bg-destructive text-white ml-2">
                      {product.discount}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-semibold">{formattedOriginalPrice}</span>
                )}
              </div>
              
              <div className="flex items-center mb-2">
                <Badge variant="outline" className={product.stockStatus === 'In Stock' ? 'text-green-600 border-green-600' : 'text-amber-600 border-amber-600'}>
                  {product.stockStatus}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>
            
            {/* Variants */}
            {product.variants && product.variants.map(variant => (
              <div key={variant.name}>
                <h3 className="font-medium mb-2">
                  {variant.name}: <span className="text-primary">{selectedVariants[variant.name] || "Select an option"}</span>
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleVariantChange(variant.name, option)}
                      className={`px-3 py-1 border rounded-md transition-all ${
                        selectedVariants[variant.name] === option 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <MinusCircle size={20} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
              
              <Button 
                className="flex-1 gap-2" 
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={isWishlisted ? 'text-red-500' : ''}
                onClick={toggleWishlist}
              >
                <Heart className={isWishlisted ? 'fill-red-500' : ''} size={18} />
              </Button>
              
              <Button variant="outline" size="icon">
                <Share2 size={18} />
              </Button>
            </div>
            
            {/* Product Highlights */}
            <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
              <div className="flex items-start gap-2">
                <Check size={18} className="text-green-500 mt-0.5" />
                <span>Fast shipping on orders over $50</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={18} className="text-green-500 mt-0.5" />
                <span>Satisfaction guaranteed or your money back</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={18} className="text-green-500 mt-0.5" />
                <span>Dedicated customer support for growing advice</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12 max-md:hidden">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 mb-6">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="growing">Growing Information</TabsTrigger>
            <TabsTrigger value="info">Additional Information</TabsTrigger>
            <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <p className="mb-4">{product.description}</p>
            <h3 className="text-lg font-medium mb-2">Features & Benefits</h3>
            <ul className="space-y-2 list-disc pl-6">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="growing" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Growing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.productInfo && Object.entries(product.productInfo).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <div className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.additionalInfo && Object.entries(product.additionalInfo).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <div className="font-medium text-muted-foreground">{key}</div>
                  <div>{Array.isArray(value) ? value.join(', ') : value}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Customer Reviews</h2>
                <Button>Write a Review</Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Review Summary */}
                <Card className="col-span-1">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{product.reviewCount} reviews</p>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = product.reviews.filter(r => Math.floor(r.rating) === stars).length;
                        const percentage = (count / product.reviews.length) * 100;
                        
                        return (
                          <div key={stars} className="flex items-center gap-2">
                            <div className="flex items-center">
                              {stars} <Star size={12} className="ml-1 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground w-8 text-right">
                              {percentage.toFixed(0)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Review List */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                  {product.reviews.map(review => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium flex items-center gap-2">
                            {review.user}
                            {review.isVerified && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                        <p className="text-muted-foreground">{review.comment}</p>
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm">
                            Was this review helpful?
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Yes</Button>
                            <Button variant="outline" size="sm">No</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-4">Write a Review</h4>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="review-title">Review Title</Label>
                        <Input id="review-title" />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className="text-gray-300 hover:text-yellow-400"
                            >
                              <Star size={24} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <textarea 
                          id="comment"
                          rows={4}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <Button type="submit">Submit Review</Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping">
            <h2 className="text-2xl font-semibold mb-4">Shipping & Returns</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Policy</h3>
                <p>We offer free standard shipping on all orders over $50. Orders under $50 will be charged a flat rate of $5.99. Standard shipping typically takes 3-5 business days, depending on your location.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Express Shipping</h3>
                <p>Need your items faster? Choose express shipping at checkout for delivery within 1-2 business days. Express shipping costs $12.99.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Return Policy</h3>
                <p>We accept returns within 30 days of the delivery date. Items must be unused, unopened, and in the original packaging with all tags attached. Return shipping is free for orders over $50.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Special Considerations for Plants & Seeds</h3>
                <p>Due to the nature of agricultural products, all seed and plant sales are final unless the product is defective. If you receive damaged plants or seeds with poor germination rates, please contact our customer service within 14 days of delivery.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">How to Initiate a Return</h3>
                <p>To start a return, please visit our <Link href="#" className="text-primary hover:underline">Returns Portal</Link> or contact our customer service team at support@example.com.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(AGRICULTURAL_PRODUCTS).filter(p => p.id !== product.id).slice(0, 4).map((relatedProduct) => (
              <div key={relatedProduct.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/product/${relatedProduct.id}`} className="block">
                  <img 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name}
                    className="w-full aspect-square object-cover object-center" 
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2">{relatedProduct.name}</h3>
                    <div className="text-sm font-semibold mt-1">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(relatedProduct.price)}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;