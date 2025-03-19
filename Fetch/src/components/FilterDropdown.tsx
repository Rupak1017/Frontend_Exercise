// src/components/FilterDropdown.tsx
import React from 'react';
import Button from './Button';

interface FilterDropdownProps {
  sortOrder: 'asc' | 'desc';
  onSetSortOrder: (order: 'asc' | 'desc') => void;
  ageMin: number | null;
  ageMax: number | null;
  onSetAgeMin: (value: number | null) => void;
  onSetAgeMax: (value: number | null) => void;
  locationCity: string;
  onSetLocationCity: (value: string) => void;
  applyLocationFilter: () => void;
  clearLocationFilter: () => void;
  locationZipCodes: string[] | null;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  sortOrder,
  onSetSortOrder,
  ageMin,
  ageMax,
  onSetAgeMin,
  onSetAgeMax,
  locationCity,
  onSetLocationCity,
  applyLocationFilter,
  clearLocationFilter,
  locationZipCodes,
}) => {
  // Check if a location filter has been applied
  const isLocationApplied = locationZipCodes !== null && locationZipCodes.length > 0;

  return (
    <div className="absolute right-36 top-full mt-2 z-50 transition-all duration-900 ease-in-out bg-white border rounded p-2 shadow w-auto">
      {/* Sort by Breed Section */}
      <div className="mb-2">
        <h3 className="font-bold text-sm mb-1">Sort by Breed</h3>
        <div className="flex gap-2">
          <Button onClick={() => onSetSortOrder('asc')} variant="sortBreed">
            A → Z
          </Button>
          <Button onClick={() => onSetSortOrder('desc')} variant="sortBreed">
            Z → A
          </Button>
        </div>
      </div>
      {/* Age Filter Section */}
      <div className="mb-2">
        <h3 className="font-bold text-sm mb-1">Age</h3>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={ageMin !== null ? ageMin : ''} 
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              onSetAgeMin(value !== null ? Math.max(0, Math.min(14, value)) : null);
            }} 
            className="border rounded px-2 py-1 w-16 text-xs"
            min="0" 
            max="14"
          />
          <input 
            type="number" 
            placeholder="Max" 
            value={ageMax !== null ? ageMax : ''} 
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              onSetAgeMax(value !== null ? Math.max(0, Math.min(14, value)) : null);
            }} 
            className="border rounded px-2 py-1 w-16 text-xs"
            min="0" 
            max="14"
          />
        </div>
      </div>
      {/* City Filter Section */}
      <div>
        <h3 className="font-bold text-sm mb-1">City</h3>
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            placeholder="City" 
            value={locationCity} 
            onChange={(e) => onSetLocationCity(e.target.value)} 
            className="border rounded px-2 py-1 w-24 text-xs"
          />
          {isLocationApplied ? (
            <Button onClick={clearLocationFilter} variant="sortLocation">
              Clear
            </Button>
          ) : (
            <Button onClick={applyLocationFilter} variant="sortLocation">
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
