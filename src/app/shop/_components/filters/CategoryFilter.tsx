
import React from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import FilterCheckbox from './FilterCheckbox';

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categoryId: string, checked: boolean) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="categories">
      <AccordionItem value="categories" className="border-none">
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <FilterCheckbox
                key={category.id}
                id={`category-${category.id}`}
                label={category.label}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => onChange(category.id, checked)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryFilter;