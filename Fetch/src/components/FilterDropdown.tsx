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
  // Determine if a filter has been applied based on zip codes in the location filter.
  const isLocationApplied = locationZipCodes !== null && locationZipCodes.length > 0;

  // Reset only the age fields to null.
  // The parent's useEffect watching ageMin/ageMax will reload dogs with no age filter.
  const handleResetAgeFilter = () => {
    onSetAgeMin(null);
    onSetAgeMax(null);
    // If you also want to ensure the sort is forced back to "asc", uncomment below:
    // onSetSortOrder('asc');
  };

  return (
    <div
      className="
        absolute top-full mt-2 z-50 transition-all duration-300 transform origin-top-right
        bg-white border rounded p-2 shadow w-auto
        right-0 md:right-36
      "
    >
      {/* ---------------------- Sort by Breed Section ---------------------- */}
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

      {/* ---------------------- Age Filter Section ---------------------- */}
      <div className="mb-2">
        <h3 className="font-bold text-sm mb-1">Age</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={ageMin !== null ? ageMin : ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onSetAgeMin(val !== null ? Math.max(0, Math.min(14, val)) : null);
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
              const val = e.target.value ? Number(e.target.value) : null;
              onSetAgeMax(val !== null ? Math.max(0, Math.min(14, val)) : null);
            }}
            className="border rounded px-2 py-1 w-16 text-xs"
            min="0"
            max="14"
          />

          {/* Show the red cross only if either ageMin or ageMax is non-null */}
          {(ageMin !== null || ageMax !== null) && (
            <button
              onClick={handleResetAgeFilter}
              className="text-red-500 hover:text-red-600"
              title="Reset Age Filter"
            >
              <i className="ri-close-circle-line text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* ---------------------- City Filter Section ---------------------- */}
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
