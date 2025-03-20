// src/components/NavBar.tsx
import React, { useState } from 'react';
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
  // Controls the mobile hamburger menu dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative mt-6 mb-4 border-b border-black pb-4 min-h-[60px]">
      {/*
        ===========================
        DESKTOP VIEW (md and above)
        ===========================
      */}
      <div className="hidden md:block">
        {/* Left: Logo/Text (absolute) */}
        <div className="absolute top-0 left-0">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Fur <span className="text-yellow-400">Buddy</span>
            <img src="/images/dog.png" alt="Dog Icon" className="h-10 w-10" />
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex justify-center">
          <BreedSearchBar
            breeds={breedNames}
            onSelect={onBreedSelect}
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
          <Button onClick={onLogout} variant="logout" className="flex items-center gap-1">
            <i className="ri-logout-box-line text-xl"></i> Logout
          </Button>
        </div>
      </div>

      {/*
        =======================
        MOBILE VIEW (below md)
        =======================
      */}
      <div className="md:hidden">
        {/* Top row: Logo (left) + Hamburger (right) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Fur <span className="text-yellow-400">Buddy</span>
            <img src="/images/dog.png" alt="Bone Icon" className="h-7 w-7" />
          </h1>
          {/* Wrap hamburger in a relative container */}
          <div className="relative">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="menu"
              className="text-sm px-2 py-1"
            >
              <i className="ri-menu-line"></i>
            </Button>
            {mobileMenuOpen && (
              <div
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-36 z-50
                           transition-all duration-300 transform origin-top-right"
              >
                <Button
                  onClick={() => {
                    onFavoritesClick();
                    setMobileMenuOpen(false);
                  }}
                  variant="fav"
                  className="w-full text-left px-2 py-1 text-sm"
                >
                  Favorites
                </Button>
                <Button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="logout"
                  className="w-full text-left px-2 py-1 text-sm flex items-center gap-1"
                >
                  <i className="ri-logout-box-line "></i> Logout
                  
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Second row: Search Bar (left) + Filter (right) */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex-1">
            <BreedSearchBar
              breeds={breedNames}
              onSelect={onBreedSelect}
            />
          </div>
          <Button
            onClick={onToggleFilters}
            variant="filter"
            className="text-sm px-2 py-1"
          >
            <i className="ri-filter-3-line"></i>
          </Button>
        </div>
      </div>

      {/*
        Filter Dropdown (common to both views).
        Positioned absolutely. For mobile, it's aligned to the right edge.
      */}
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
