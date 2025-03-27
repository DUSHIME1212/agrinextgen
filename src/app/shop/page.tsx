"use client"

import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShopSidebar from "./_components/ShopSidebar";
import { Product, ProductsResponse } from "@/strapi/types";
import { fetchProducts } from "@/strapi/api";


// Agricultural product data
const AGRICULTURAL_PRODUCTS = [
  {
    id: "product-1",
    name: "Organic Tomato Seeds",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1592921870789-04563d55041c",
    category: "Seeds & Plants",
    rating: 4.8,
    isNew: true,
    isSale: false,
  },
  {
    id: "product-2",
    name: "Heavy-Duty Garden Shears",
    price: 24.95,
    image: "https://images.unsplash.com/photo-1585513553738-84dae37a6ccc",
    category: "Equipment & Tools",
    rating: 4.6,
    isNew: false,
    isSale: true,
  },
  {
    id: "product-3",
    name: "Organic Compost - 5kg Bag",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1628532197375-82e27629d5df",
    category: "Fertilizers",
    rating: 4.9,
    isNew: false,
    isSale: true,
  },
  {
    id: "product-4",
    name: "Advanced Drip Irrigation Kit",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2",
    category: "Irrigation Systems",
    rating: 4.7,
    isNew: false,
    isSale: false,
  },
  {
    id: "product-5",
    name: "Organic Pest Control Spray",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1586767003402-8ade266ede78",
    category: "Organic Products",
    rating: 4.3,
    isNew: true,
    isSale: false,
  },
  {
    id: "product-6",
    name: "Livestock Feed Supplement",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1560884854-2b10de2e329b",
    category: "Livestock Supplies",
    rating: 4.5,
    isNew: false,
    isSale: true,
  },
  {
    id: "product-7",
    name: "Soil pH Testing Kit",
    price: 18.75,
    image: "https://images.unsplash.com/photo-1581245240557-8e100a798702",
    category: "Equipment & Tools",
    rating: 4.2,
    isNew: false,
    isSale: false,
  },
  {
    id: "product-8",
    name: "Heirloom Vegetable Seed Collection",
    price: 29.95,
    image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9",
    category: "Seeds & Plants",
    rating: 4.9,
    isNew: true,
    isSale: false,
  },
  {
    id: "product-9",
    name: "Collapsible Water Tank - 250L",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1559628233-100c798642d4",
    category: "Irrigation Systems",
    rating: 4.4,
    isNew: false,
    isSale: false,
  },
  {
    id: "product-10",
    name: "Biodegradable Mulch Film",
    price: 22.50,
    image: "https://images.unsplash.com/photo-1597380281651-45c1a8061401",
    category: "Organic Products",
    rating: 4.1,
    isNew: false,
    isSale: true,
  },
  {
    id: "product-11",
    name: "Solar Electric Fence Energizer",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1596521736183-cb45d7a634d8",
    category: "Livestock Supplies",
    rating: 4.7,
    isNew: true,
    isSale: false,
  },
  {
    id: "product-12",
    name: "Slow-Release Fertilizer Pellets",
    price: 15.95,
    image: "https://images.unsplash.com/photo-1631585802046-4a08ac0675ba",
    category: "Fertilizers",
    rating: 4.6,
    isNew: false,
    isSale: false,
  }
];

// Category to ID mapping for URL params
const CATEGORY_MAP: Record<string, string> = {
  'seeds-plants': 'Seeds & Plants',
  'equipment-tools': 'Equipment & Tools',
  'fertilizers': 'Fertilizers',
  'irrigation-systems': 'Irrigation Systems',
  'organic-products': 'Organic Products',
  'livestock-supplies': 'Livestock Supplies',
  'natural-oils': 'Natural Oils',
};

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { category } = useParams<{category?: string}>();
  const [filters, setFilters] = useState<aRW>({
    search: '',
    categories: category ? ['category-' + category] : [],
    brands: [],
    priceRange: '',
    productTypes: [],
    rating: 0,
    onSale: false,
    inStock: true,
    newArrivals: false,
  });
  const [sortOption, setSortOption] = useState<string>('featured');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
      const getProducts = async () => {
        try {
          const data: ProductsResponse = await fetchProducts();
          setProducts(data.data); 
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      getProducts();
    }, []);
  
  
    useEffect(() => {
      let results = [...products];
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          (product.Category && product.Category.toLowerCase().includes(searchLower))
        );
      }
      
      // Category filter from URL param
      if (category && CATEGORY_MAP[category]) {
        results = results.filter(product => product.Category === CATEGORY_MAP[category]);
      }
      // Or from sidebar selection
      else if (filters.categories && filters.categories.length > 0) {
        const selectedCategories = filters.categories.map((id: string) => {
          const categoryKey = id.replace('category-', '');
          return CATEGORY_MAP[categoryKey] || '';
        }).filter(Boolean);
        
        if (selectedCategories.length > 0) {
          results = results.filter(product => selectedCategories.includes(product.Category));
        }
      }
      
      // Price range filter
      if (filters.priceRange) {
        switch (filters.priceRange) {
          case 'under15':
            results = results.filter(product => product.price < 15);
            break;
          case '15-30':
            results = results.filter(product => product.price >= 15 && product.price <= 30);
            break;
          case '30-50':
            results = results.filter(product => product.price > 30 && product.price <= 50);
            break;
          case '50plus':
            results = results.filter(product => product.price > 50);
            break;
        }
      }
      
      // Rating filter
      if (filters.rating > 0) {
        results = results.filter(product => product.rating >= filters.rating);
      }
      
      // Sale items filter (using discount field)
      if (filters.onSale) {
        results = results.filter(product => product.discount && product.discount > 0);
      }
      
      // New arrivals filter
      if (filters.newArrivals) {
        results = results.filter(product => product.isNew);
      }
      
      results = sortProducts(results, sortOption);
      
      setFilteredProducts(results);
    }, [filters, sortOption, category, products]);
  
  const handleFilterChange = (newFilters: aRW) => {
    setFilters(newFilters);
  };
  
  const sortProducts = (products: Product[], option: string): Product[] => {
    const sorted = [...products];
    
    switch (option) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return sorted;
    }
  };
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        ...(category ? [{ name: CATEGORY_MAP[category] || 'Category', path: `/shop/${category}` }] : [])
      ]}
      fullWidth
      className="px-8 md:px-16 w-screen"
    >
      <div className="py-8">
        <div className="container-custom px-4">
          <h1 className="text-3xl font-bold mb-6">
            {category && CATEGORY_MAP[category] 
              ? `${CATEGORY_MAP[category]}`
              : 'Agricultural Products'}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-full md:w-64 lg:w-72 shrink-0">
              <ShopSidebar onFilterChange={handleFilterChange} className="sticky top-20" />
            </aside>
            
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between">
                    <span>Filters</span> <SlidersHorizontal size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                  <ShopSidebar onFilterChange={handleFilterChange} />
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                  {filteredProducts.length === 0 && filters && 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary" 
                      onClick={() => setFilters({})}
                    >
                      Clear all filters
                    </Button>
                  }
                </p>
                <Select 
                  value={sortOption} 
                  onValueChange={setSortOption}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                    className="bg-card text-card-foreground"
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.productimg?.[0]?.url || '/placeholder-product.jpg'}
                    category={product.Category}
                    rating={product.rating}
                    isNew={product.isNew}
                    isSale={!!product.discount}
                    slug={product.slug}
                  />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={() => setFilters({})}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
