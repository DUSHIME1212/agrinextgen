import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ProtectedRoute from "@/components/protected-route";

const Page: React.FC = () => {
  const currentUser = {
    role: "customer",
  };

  // Sample wishlist items - in a real app, these would come from an API or state
  const wishlistItems = [
    {
      id: "1",
      name: "Organic Tomato Seeds",
      price: 4.99,
      image: "/placeholder.svg",
      stock: "In Stock",
    },
    {
      id: "2",
      name: "Garden Pruning Shears",
      price: 12.99,
      image: "/placeholder.svg",
      stock: "In Stock",
    },
    {
      id: "3",
      name: "Natural Fertilizer - 2kg",
      price: 8.49,
      image: "/placeholder.svg",
      stock: "Low Stock",
    },
  ];

  return (
    <Layout
    showBreadcrumb={false}
    >
      <div className="py-12">
        <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

        {currentUser?.role === "customer" ? (
          wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <PlaceholderImage
                      // src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2 min-h-24 font-semibold">{item.name}</h3>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-medium">
                Your wishlist is empty
              </h2>
              <p className="mb-6 text-muted-foreground">
                Items added to your wishlist will be saved here
              </p>
              <Button asChild className="mx-auto">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          )
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              The wishlist feature is only available for customers.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default Page;
