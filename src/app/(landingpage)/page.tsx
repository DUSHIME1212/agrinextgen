"use client";

import HeroBannerCta from "@/components/home/Banner";
import Categories from "@/components/home/CategoryCard";
import FeaturedProducts from "@/components/home/featuredProducts";
import Hero from "@/components/home/Hero";
import HeroBanner from "@/components/home/HeroBanner";
import HeroFeatures from "@/components/home/HeroFeatures";
import LatestBlogs from "@/components/home/latestBlogs";
import Layout from "@/components/layout/Layout";
import CartPopup from "@/components/shop/CartPopup";
import React, { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Organic Tomato Seeds",
    price: 4.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1592921870789-04563d55041c",
    attributes: {
      "Package Size": "Medium Pack",
    },
  },
];

const page = ({ children }: { children: React.ReactNode }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };
  return (
    <Layout showBreadcrumb={false} fullWidth className="">
      <div className="relative flex min-h-screen flex-col max-md:gap-8">
        <div className="absolute inset-0 z-0 opacity-75">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23176D45' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <Hero className="px-8 md:px-16" />
        <HeroFeatures className="px-8 md:px-16" />
        <FeaturedProducts className="px-8 md:px-16" />
        <HeroBanner className="px-8 md:px-16" />

        <Categories className="px-8 md:px-16" />
        <LatestBlogs className="px-8 md:px-16" />
        <HeroBannerCta />
        <CartPopup
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </Layout>
  );
};

export default page;
