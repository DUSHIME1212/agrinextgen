
import React from 'react';
import FilterCheckbox from './FilterCheckbox';

interface QuickFiltersProps {
  onSale: boolean;
  inStock: boolean;
  newArrivals: boolean;
  onChange: (key: 'onSale' | 'inStock' | 'newArrivals', checked: boolean) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  onSale,
  inStock,
  newArrivals,
  onChange
}) => {
  return (
    <div className="space-y-2 mb-4">
      <FilterCheckbox
        id="filter-sale"
        label="On Sale"
        checked={onSale}
        onCheckedChange={(checked) => onChange('onSale', checked)}
      />
      
      <FilterCheckbox
        id="filter-instock"
        label="In Stock"
        checked={inStock}
        onCheckedChange={(checked) => onChange('inStock', checked)}
      />
      
      <FilterCheckbox
        id="filter-new"
        label="New Arrivals"
        checked={newArrivals}
        onCheckedChange={(checked) => onChange('newArrivals', checked)}
      />
    </div>
  );
};

export default QuickFilters;