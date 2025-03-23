"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';

// Import filter components
import SearchFilter from './filters/SearchFilter';
import QuickFilters from './filters/QuickFilters';
import CategoryFilter from './filters/CategoryFilter';
import BrandFilter from './filters/BrandFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import ProductTypeFilter from './filters/ProductTypeFilter';
import RatingFilter from './filters/RatingFilter';

// Agricultural product filter categories
const CATEGORIES = [
  { id: 'seeds-plants', label: 'Seeds & Plants' },
  { id: 'equipment-tools', label: 'Equipment & Tools' },
  { id: 'fertilizers', label: 'Fertilizers' },
  { id: 'irrigation-systems', label: 'Irrigation Systems' },
  { id: 'organic-products', label: 'Organic Products' },
  { id: 'livestock-supplies', label: 'Livestock Supplies' },
];

const BRANDS = [
  { id: 'greenthumb-organics', label: 'GreenThumb Organics' },
  { id: 'farmtech', label: 'FarmTech' },
  { id: 'agripro', label: 'AgriPro' },
  { id: 'earthwise', label: 'Earthwise' },
  { id: 'gardenmaster', label: 'GardenMaster' },
];

const PRICE_RANGES = [
  { id: 'under15', label: 'Under $15' },
  { id: '15-30', label: '$15 - $30' },
  { id: '30-50', label: '$30 - $50' },
  { id: '50plus', label: '$50+' },
];

const PRODUCT_TYPES = [
  { id: 'organic', label: 'Organic' },
  { id: 'heirloom', label: 'Heirloom' },
  { id: 'non-gmo', label: 'Non-GMO' },
  { id: 'sustainable', label: 'Sustainable' },
];

const RATINGS = [5, 4, 3, 2, 1];

interface ShopSidebarProps {
  className?: string;
  onFilterChange?: (filters: any) => void;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ 
  className,
  onFilterChange
}) => {
  const [filters, setFilters] = useState({
    search: '',
    categories: [] as string[],
    brands: [] as string[],
    priceRange: '',
    productTypes: [] as string[],
    rating: 0,
    onSale: false,
    inStock: false,
    newArrivals: false,
  });

  const updateFilters = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newCategories;
    if (checked) {
      newCategories = [...filters.categories, categoryId];
    } else {
      newCategories = filters.categories.filter(id => id !== categoryId);
    }
    updateFilters('categories', newCategories);
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    let newBrands;
    if (checked) {
      newBrands = [...filters.brands, brandId];
    } else {
      newBrands = filters.brands.filter(id => id !== brandId);
    }
    updateFilters('brands', newBrands);
  };

  const handleProductTypeChange = (typeId: string, checked: boolean) => {
    let newTypes;
    if (checked) {
      newTypes = [...filters.productTypes, typeId];
    } else {
      newTypes = filters.productTypes.filter(id => id !== typeId);
    }
    updateFilters('productTypes', newTypes);
  };

  const handleCheckboxChange = (key: 'onSale' | 'inStock' | 'newArrivals', checked: boolean) => {
    updateFilters(key, checked);
  };

  const resetFilters = () => {
    const resetState = {
      search: '',
      categories: [],
      brands: [],
      priceRange: '',
      productTypes: [],
      rating: 0,
      onSale: false,
      inStock: false,
      newArrivals: false,
    };
    setFilters(resetState);
    if (onFilterChange) {
      onFilterChange(resetState);
    }
  };

  return (
    <Sidebar 
      variant="floating" 
      collapsible="none"
      className={className}
    >
      <SidebarHeader className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            Reset All
          </Button>
        </div>

        <SearchFilter 
          value={filters.search}
          onChange={(value) => updateFilters('search', value)}
        />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <QuickFilters 
              onSale={filters.onSale}
              inStock={filters.inStock}
              newArrivals={filters.newArrivals}
              onChange={handleCheckboxChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <CategoryFilter 
              categories={CATEGORIES}
              selectedCategories={filters.categories}
              onChange={handleCategoryChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Brands</SidebarGroupLabel>
          <SidebarGroupContent>
            <BrandFilter 
              brands={BRANDS}
              selectedBrands={filters.brands}
              onChange={handleBrandChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Price Range</SidebarGroupLabel>
          <SidebarGroupContent>
            <PriceRangeFilter 
              priceRanges={PRICE_RANGES}
              selectedRange={filters.priceRange}
              onChange={(value) => updateFilters('priceRange', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Product Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <ProductTypeFilter 
              productTypes={PRODUCT_TYPES}
              selectedTypes={filters.productTypes}
              onChange={handleProductTypeChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Rating</SidebarGroupLabel>
          <SidebarGroupContent>
            <RatingFilter 
              ratings={RATINGS}
              selectedRating={filters.rating}
              onChange={(value) => updateFilters('rating', value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-sidebar-foreground/70">
          Advanced Filtering
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ShopSidebar;