
import React from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { RadioGroup } from '@/components/ui/radio-group';
import FilterRadio from './FilterRadio';

interface PriceRange {
  id: string;
  label: string;
}

interface PriceRangeFilterProps {
  priceRanges: PriceRange[];
  selectedRange: string;
  onChange: (range: string) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRanges,
  selectedRange,
  onChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="price">
      <AccordionItem value="price" className="border-none">
        <AccordionContent>
          <RadioGroup 
            value={selectedRange}
            onValueChange={onChange}
          >
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <FilterRadio
                  key={range.id}
                  id={`price-${range.id}`}
                  value={range.id}
                  label={range.label}
                />
              ))}
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceRangeFilter;