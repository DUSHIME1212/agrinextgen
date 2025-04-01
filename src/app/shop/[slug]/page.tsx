"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Star,
  Heart,
  Share2,
  Check,
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductById } from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";

const Page: React.FC = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const { product, isLoading } = useAppSelector((state) => state.products);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductById(slug as string));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (product && wishlistItems.length > 0) {
      const inWishlist = wishlistItems.some(
        (item) => item.productId === product.id,
      );
      setIsWishlisted(inWishlist);
    }
  }, [product, wishlistItems]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const formattedDiscountedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(discountedPrice);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`${product.name} has been added to your cart`);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      const wishlistItem = wishlistItems.find(
        (item) => item.productId === product.id,
      );
      if (wishlistItem) {
        dispatch(removeFromWishlist(wishlistItem.id));
      }
    } else {
      dispatch(addToWishlist(product.id));
    }

    setIsWishlisted(!isWishlisted);
    toast(
      isWishlisted
        ? `${product.name} has been removed from your wishlist`
        : `${product.name} has been added to your wishlist`,
    );
  };

  // Get image URLs from productimg array
  const productImages = product.productimg?.map((img) => img.url) || [];

  return (
    <Layout
    customBreadcrumbPaths={[
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: product.name, path: `/product/${product.id}` },
    ]}
    fullWidth
    className="flex flex-col mb-72 gap-4">
      <div className="container px-4 py-8">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {productImages.length > 0 ? (
                <img
                  src={productImages[mainImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              )}

              {/* Product badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-primary text-white">New</Badge>
                )}
                {product.discount && product.discount > 0 && (
                  <Badge className="bg-destructive text-white">Sale</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      mainImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

              <div className="mb-4 flex items-center gap-2">
                {product.discount ? (
                  <>
                    <span className="text-2xl font-semibold">
                      {formattedDiscountedPrice}
                    </span>
                    <span className="text-muted-foreground line-through">
                      {formattedOriginalPrice}
                    </span>
                    <Badge className="ml-2 bg-destructive text-white">
                      {product.discount}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-semibold">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>

              <div className="mb-2 flex items-center">
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-600"
                >
                  In Stock
                </Badge>
              </div>

              <p className="mb-6 text-muted-foreground">
                {product.productDescription}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border">
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

              <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={isWishlisted ? "text-red-500" : ""}
                onClick={toggleWishlist}
              >
                <Heart
                  className={isWishlisted ? "fill-red-500" : ""}
                  size={18}
                />
              </Button>

              <Button variant="outline" size="icon">
                <Share2 size={18} />
              </Button>
            </div>

            {/* Product Highlights */}
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-2">
                <Check size={18} className="mt-0.5 text-green-500" />
                <span>Fast shipping on orders over $50</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={18} className="mt-0.5 text-green-500" />
                <span>Satisfaction guaranteed or your money back</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={18} className="mt-0.5 text-green-500" />
                <span>Dedicated customer support for growing advice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12 max-md:hidden">
          <TabsList className="mb-6 grid w-full grid-cols-1 md:grid-cols-5">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="growing">Growing Information</TabsTrigger>
            <TabsTrigger value="info">Additional Information</TabsTrigger>
            <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <h2 className="mb-4 text-2xl font-semibold">Product Details</h2>
            <p className="mb-4">{product.productDescription}</p>
            <h3 className="mb-2 text-lg font-medium">Features & Benefits</h3>
            <ul className="list-disc space-y-2 pl-6">
              {product.features
                ?.split("\n")
                .map((feature, index) => <li key={index}>{feature}</li>)}
            </ul>
          </TabsContent>

          <TabsContent value="growing" className="space-y-4">
            <h2 className="mb-4 text-2xl font-semibold">Growing Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium capitalize text-muted-foreground">
                    Growing Season
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium capitalize text-muted-foreground">
                    Sun Exposure
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium capitalize text-muted-foreground">
                    Watering Needs
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium capitalize text-muted-foreground">
                    Harvest Time
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium capitalize text-muted-foreground">
                    Soil Requirements
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info">
            <h2 className="mb-4 text-2xl font-semibold">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium text-muted-foreground">SKU</div>
                  <div>{"none"}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium text-muted-foreground">Brand</div>
                  <div>{"none"}</div>
                </div>
              )}
              {product.Category && (
                <div className="border-b pb-2">
                  <div className="font-medium text-muted-foreground">
                    Category
                  </div>
                  <div>{product.Category}</div>
                </div>
              )}
              {product && (
                <div className="border-b pb-2">
                  <div className="font-medium text-muted-foreground">
                    Certification
                  </div>
                  <div>{"none"}</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Customer Reviews</h2>
                <Button>Write a Review</Button>
              </div>

              {product.reviews?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Review Summary */}
                  <Card className="col-span-1">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="mb-2 text-5xl font-bold">
                          {product.rating}
                        </div>
                        <div className="mb-2 flex justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          {product.reviews.length} reviews
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Review List */}
                  <div className="col-span-1 space-y-6 lg:col-span-2">
                    {product.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="mb-2">
                            <div className="font-medium">
                              {review.user?.name || "Anonymous"}
                            </div>
                          </div>
                          <div className="mb-2 flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <h2 className="mb-4 text-2xl font-semibold">Shipping & Returns</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium">Shipping Policy</h3>
                <p>
                  "Free shipping on all orders over $50. Orders are processed
                  and shipped within 1-2 business days."
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Return Policy</h3>
                <p>
                  We accept returns within 30 days of delivery for most items.
                  Please contact our customer service team to initiate a return.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Page;
