
import React from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import FilterCheckbox from './FilterCheckbox';

interface Brand {
  id: string;
  label: string;
}

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands: string[];
  onChange: (brandId: string, checked: boolean) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  brands,
  selectedBrands,
  onChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="brands">
      <AccordionItem value="brands" className="border-none">
        <AccordionContent>
          <div className="space-y-2">
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand.id}
                id={`brand-${brand.id}`}
                label={brand.label}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={(checked) => onChange(brand.id, checked)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BrandFilter;