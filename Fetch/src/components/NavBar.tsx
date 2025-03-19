// src/components/NavBar.tsx
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
    <header className="flex justify-between items-center mb-4">
      {/* Left: Logo */}
      <div className="w-1/4">
        <h1 className="text-2xl font-bold">Dog Page</h1>
      </div>
      {/* Center: Search Bar for Breed */}
      <div className="w-1/2">
        <BreedSearchBar 
          breeds={breedNames} 
          onSelect={onBreedSelect}
          placeholder="Search by Breed" 
        />
      </div>
      {/* Right: Filter, Favorites, Logout */}
      <div className="w-1/4 flex justify-end items-center gap-2 relative">
        <Button onClick={onToggleFilters} variant="filter">
          <i className="ri-filter-3-line"></i> Filter
        </Button>
        <Button onClick={onFavoritesClick} variant="fav">
          Favorites
        </Button>
        <Button onClick={onLogout} variant="logout">
          Logout
        </Button>
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
      </div>
    </header>
  );
};

export default NavBar;
