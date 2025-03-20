// This component provides filters for sorting and narrowing down items based on breed, age, and city.
// It is used to let the user easily adjust the view with a friendly dropdown interface.
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
  // Determine if a filter has been applied based on zip codes in the location filter.
  const isLocationApplied = locationZipCodes !== null && locationZipCodes.length > 0;

  return (
    <div
      className="
        absolute top-full mt-2 z-50 transition-all duration-300 transform origin-top-right
        bg-white border rounded p-2 shadow w-auto
        right-0 md:right-36
      "
    >
      {/* ---------------------- Sort by Breed Section ----------------------
          This section allows the user to choose sorting order by breed (A -> Z or Z -> A). */}
      <div className="mb-2">
        <h3 className="font-bold text-sm mb-1">Sort by Breed</h3>
        <div className="flex gap-7">
          <Button onClick={() => onSetSortOrder('asc')} variant="sortBreed">
            A → Z
          </Button>
          <Button onClick={() => onSetSortOrder('desc')} variant="sortBreed">
            Z → A
          </Button>
        </div>
      </div>

      {/* ---------------------- Age Filter Section ----------------------
          Lets the user set minimum and maximum age values. */}
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

      {/* ---------------------- City Filter Section ----------------------
          Provides an input field to filter by city. The related button will either apply
          the filter or clear it, depending on whether a filter was already applied. */}
      <div>
        <h3 className="font-bold text-sm mb-1">City</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Ex: (Chicago,Miami)"
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
