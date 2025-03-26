import React from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import FilterCheckbox from './FilterCheckbox';

interface ProductType {
  id: string;
  label: string;
}

interface ProductTypeFilterProps {
  productTypes: ProductType[];
  selectedTypes: string[];
  onChange: (typeId: string, checked: boolean) => void;
}

const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
  productTypes,
  selectedTypes,
  onChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="productTypes">
      <AccordionItem value="productTypes" className="border-none">
        <AccordionContent>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <FilterCheckbox
                key={type.id}
                id={`type-${type.id}`}
                label={type.label}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => onChange(type.id, checked)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductTypeFilter;