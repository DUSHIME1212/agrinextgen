"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductCard from "../shop/ProductCard";
import Link from "next/link";
import ProductQuickView from "../shop/ProductQuickView";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts, type Product } from "@/redux/slices/productSlice";

interface FeaturedProductsProps {
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ className }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<{
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    description: string;
    isNew?: boolean;
    slug?: string;
    discount?: number;
    rating?: number;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.productimg?.length
        ? product.productimg.map((img) => img.url || "")
        : ["/placeholder.svg"],
      category: product.Category || "",
      description: product.productDescription || "No description available",
      isNew: product.isNew,
      discount: product.discount || 0,
      rating: product.rating,
      slug: product.slug,
    });
  };

  return (
    <section className={cn("py-16 md:py-24 bg-muted/20 backdrop-blur-md", className)}>
      <div className="container-custom">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Discover our handpicked selection of premium agricultural products
              to help you grow better, harvest more, and farm smarter.
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-4 inline-flex items-center font-medium text-primary hover:text-primary/80 md:mt-0"
          >
            View All Products
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-lg bg-muted"
                  ></div>
                ))
            : products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.productimg?.[0]?.url || "/placeholder.svg"}
                    category={product.Category || ""}
                    isNew={product.isNew}
                    isSale={!!product.discount}
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
