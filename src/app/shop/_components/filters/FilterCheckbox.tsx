
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  id,
  label,
  checked,
  onCheckedChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
      />
      <Label 
        htmlFor={id}
        className="text-sm font-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default FilterCheckbox;