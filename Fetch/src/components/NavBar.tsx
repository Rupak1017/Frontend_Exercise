import React from 'react';
import BreedSearchBar from './BreedSearchBar';
import Button from './Button';
import FilterDropdown from './FilterDropdown';
import { Dog } from '../types';

interface NavBarProps {
  breedNames: string[];
  onBreedSelect: (breed: string) => void;
  selectedBreed: string | null;
  showFilters: boolean;
  onToggleFilters: () => void;
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
  onFavoritesClick: () => void;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  breedNames,
  onBreedSelect,
  selectedBreed,
  showFilters,
  onToggleFilters,
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
  onFavoritesClick,
  onLogout,
}) => {
  return (
    <header className="relative mt-6 mb-4 border-b border-black pb-4">
      {/* Left: Logo/Text */}
      <div className="absolute top-0 left-0">
        <h1 className="text-xl font-bold">Dog Page</h1>
      </div>
      {/* Center: Search Bar */}
      <div className="flex justify-center">
        <BreedSearchBar 
          breeds={breedNames} 
          onSelect={onBreedSelect}
          placeholder="Search by Breed" 
        />
      </div>
      {/* Right: Filter, Favorites, Logout */}
      <div className="absolute top-0 right-0 flex items-center gap-4">
        <Button onClick={onToggleFilters} variant="filter">
          <i className="ri-filter-3-line"></i> Filter
        </Button>
        <Button onClick={onFavoritesClick} variant="fav">
          Favorites
        </Button>
        <Button onClick={onLogout} variant="logout">
          Logout
        </Button>
      </div>
      {showFilters && (
        <FilterDropdown
          sortOrder={sortOrder}
          onSetSortOrder={onSetSortOrder}
          ageMin={ageMin}
          ageMax={ageMax}
          onSetAgeMin={onSetAgeMin}
          onSetAgeMax={onSetAgeMax}
          locationCity={locationCity}
          onSetLocationCity={onSetLocationCity}
          applyLocationFilter={applyLocationFilter}
          clearLocationFilter={clearLocationFilter}
          locationZipCodes={locationZipCodes}
        />
      )}
    </header>
  );
};

export default NavBar;
