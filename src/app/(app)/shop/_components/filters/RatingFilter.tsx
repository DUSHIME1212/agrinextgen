
import React from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { RadioGroup } from '@/components/ui/radio-group';
import FilterRadio from './FilterRadio';

interface RatingFilterProps {
  ratings: number[];
  selectedRating: number;
  onChange: (rating: number) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  ratings,
  selectedRating,
  onChange
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="rating">
      <AccordionItem value="rating" className="border-none">
        <AccordionContent>
          <RadioGroup 
            value={selectedRating.toString()}
            onValueChange={(value) => onChange(parseInt(value))}
          >
            <div className="space-y-2">
              {ratings.map((rating) => (
                <FilterRadio
                  key={rating}
                  id={`rating-${rating}`}
                  value={rating.toString()}
                  label={
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="ml-1">& Up</span>
                    </div>
                  }
                />
              ))}
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RatingFilter;