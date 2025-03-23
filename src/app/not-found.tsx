"use client"


import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NotFound: React.FC = () => {
  const location = usePathname();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  return (
    <Layout showBreadcrumb={false}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-9xl font-bold text-primary/10">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground">
            We couldn&apos;t find the page you were looking for. The link might be incorrect or the page may have been removed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
              <Link href="/"><Home size={18} /> Return to Home</Link>
            </Button>
            
            <Button size="lg" className="flex items-center gap-2" asChild>
              <Link href="/shop">Browse Products <ArrowLeft size={18} className="rotate-180" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;