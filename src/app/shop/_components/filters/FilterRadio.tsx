import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FilterRadioProps {
  id: string;
  value: string;
  label: React.ReactNode;
}

const FilterRadio: React.FC<FilterRadioProps> = ({
  id,
  value,
  label
}) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label 
        htmlFor={id}
        className="text-sm font-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default FilterRadio;