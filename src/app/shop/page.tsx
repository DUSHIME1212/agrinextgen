"use client"

import Layout from "@/components/layout/Layout"
import ProductCard from "@/components/shop/ProductCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, SlidersHorizontal, ShoppingBag } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ShopSidebar from "./_components/ShopSidebar"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchProducts } from "@/redux/slices/productSlice"
import ProductQuickView from "@/components/shop/ProductQuickView"

// Category to ID mapping for URL params
const CATEGORY_MAP: Record<string, string> = {
  "seeds-plants": "Seeds & Plants",
  "equipment-tools": "Equipment & Tools",
  fertilizers: "Fertilizers",
  "irrigation-systems": "Irrigation Systems",
  "organic-products": "Organic Products",
  "livestock-supplies": "Livestock Supplies",
  "natural-oils": "Natural Oils",
}

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: string
  productTypes: string[]
  rating: number
  onSale: boolean
  inStock: boolean
  newArrivals: boolean
}

const Page = () => {
  const { category } = useParams<{ category?: string }>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { products, isLoading, pagination } = useAppSelector((state) => state.products)

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: category ? ["category-" + category] : [],
    brands: [],
    priceRange: "",
    productTypes: [],
    rating: 0,
    onSale: false,
    inStock: true,
    newArrivals: false,
  })
  const [sortOption, setSortOption] = useState<string>("featured")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 20
      }),
    )
  }, [dispatch, category, currentPage])

  useEffect(() => {
    let results = [...products]
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.Category && product.Category.toLowerCase().includes(searchLower)),
      )
    }

    // Category filter from URL param
    if (category && CATEGORY_MAP[category as string]) {
      results = results.filter((product) => product.Category === CATEGORY_MAP[category as string])
    }
    // Or from sidebar selection
    else if (filters.categories && filters.categories.length > 0) {
      const selectedCategories = filters.categories
        .map((id: string) => {
          const categoryKey = id.replace("category-", "")
          return CATEGORY_MAP[categoryKey] || ""
        })
        .filter(Boolean)

      if (selectedCategories.length > 0) {
        results = results.filter((product) => selectedCategories.includes(product.Category || ""))
      }
    }

    // Price range filter
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case "under15":
          results = results.filter((product) => product.price < 15)
          break
        case "15-30":
          results = results.filter((product) => product.price >= 15 && product.price <= 30)
          break
        case "30-50":
          results = results.filter((product) => product.price > 30 && product.price <= 50)
          break
        case "50plus":
          results = results.filter((product) => product.price > 50)
          break
      }
    }

    // Rating filter
    if (filters.rating > 0) {
      results = results.filter((product) => product.rating >= filters.rating)
    }

    // Sale items filter (using discount field)
    if (filters.onSale) {
      results = results.filter((product) => product.discount && product.discount > 0)
    }
    if (filters.newArrivals) {
      results = results.filter((product) => product.isNew)
    }

    results = sortProducts(results, sortOption)

    setFilteredProducts(results)
  }, [filters, sortOption, category, products])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleQuickView = (product: any) => {
    setQuickViewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.productimg?.length ? product.productimg.map((img: any) => img.url || "") : ["/placeholder.svg"],
      category: product.Category,
      description: product.productDescription || "No description available",
      isNew: product.isNew,
      discount: product.discount || 0,
      rating: product.rating,
      slug: product.slug,
    })
  }

  const sortProducts = (products: any[], option: string): any[] => {
    const sorted = [...products]

    switch (option) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return sorted
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  useEffect(() => {
    console.log("Total products from API:", products.length);
    console.log("Filtered products:", filteredProducts.length);
  }, [products, filteredProducts]);
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        ...(category ? [{ name: CATEGORY_MAP[category as string] || "Category", path: `/shop/${category}` }] : []),
      ]}
      fullWidth
      className="px-8 md:px-16 w-screen"
    >
      <div className="py-8">
        <div className="container-custom px-4">
          <h1 className="text-3xl font-bold mb-6">
            {category && CATEGORY_MAP[category as string]
              ? `${CATEGORY_MAP[category as string]}`
              : "Agricultural Products"}
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
                  {filteredProducts.length === 0 &&
                    Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v))) && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() =>
                          setFilters({
                            search: "",
                            categories: category ? ["category-" + category] : [],
                            brands: [],
                            priceRange: "",
                            productTypes: [],
                            rating: 0,
                            onSale: false,
                            inStock: true,
                            newArrivals: false,
                          })
                        }
                      >
                        Clear all filters
                      </Button>
                    )}
                </p>
                <Select value={sortOption} onValueChange={setSortOption}>
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

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.productimg?.[0]?.url || "/placeholder.svg"}
                        category={product.Category || ""}
                        rating={product.rating}
                        isNew={product.isNew}
                        isSale={!!product.discount}
                        slug={product.slug}
                        onQuickView={() => handleQuickView(product)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button
                    onClick={() =>
                      setFilters({
                        search: "",
                        categories: category ? ["category-" + category] : [],
                        brands: [],
                        priceRange: "",
                        productTypes: [],
                        rating: 0,
                        onSale: false,
                        inStock: true,
                        newArrivals: false,
                      })
                    }
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      )}
    </Layout>
  )
}

export default Page

