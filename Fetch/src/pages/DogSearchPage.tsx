// src/pages/DogSearchPage.tsx
import React, { useEffect, useState } from 'react';
import DogCard from '../components/DogCard';
import { fetchDogsDetails } from '../api/dogs';
import { searchLocations } from '../api/locations';
import axios from 'axios';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import BreedSearchBar from '../components/BreedSearchBar';
import Button from '../components/Button'; // Using our reusable Button component
import { Dog } from '../types';

interface SearchResults {
  resultIds: string[];
  total: number;
}

const PAGE_SIZE = 25;
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const DogSearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [pagination, setPagination] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [breedNames, setBreedNames] = useState<string[]>([]);
  
  const [ageMin, setAgeMin] = useState<number | null>(null);
  const [ageMax, setAgeMax] = useState<number | null>(null);
  
  // Location filter (using city)
  const [locationCity, setLocationCity] = useState<string>('');
  const [locationZipCodes, setLocationZipCodes] = useState<string[] | null>(null);
  
  // Sorting state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [userHasToggledSort, setUserHasToggledSort] = useState<boolean>(false);
  
  // Favorites state (persisted via localStorage)
  const [favorites, setFavorites] = useState<Dog[]>([]);
  
  // Show/hide filter dropdown
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Load persisted favorites on mount.
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const updateFavoritesStorage = (newFavorites: Dog[]) => {
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const toggleFavorite = (dog: Dog) => {
    setFavorites(prev => {
      let newFavorites;
      const exists = prev.find(fav => fav.id === dog.id);
      if (exists) {
        newFavorites = prev.filter(fav => fav.id !== dog.id);
      } else {
        newFavorites = [...prev, dog];
      }
      updateFavoritesStorage(newFavorites);
      return newFavorites;
    });
  };

  const getPaginationNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 4) { start = 2; end = 4; }
    if (currentPage >= totalPages - 3) { start = totalPages - 3; end = totalPages - 1; }
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const loadDogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const sortParam = (ageMin !== null || ageMax !== null) && !userHasToggledSort
        ? 'age:asc'
        : `breed:${sortOrder}`;
      const params: any = { sort: sortParam, size: PAGE_SIZE, from };
      if (selectedBreed) params.breeds = [selectedBreed];
      if (ageMin !== null) params.ageMin = ageMin;
      if (ageMax !== null) params.ageMax = ageMax;
      if (locationZipCodes) params.zipCodes = locationZipCodes;
      const response = await axios.get(`${API_BASE_URL}/dogs/search`, { params, withCredentials: true });
      const searchResults: SearchResults = response.data;
      setPagination(searchResults);
      setCurrentPage(page);
      const dogDetails = await fetchDogsDetails(searchResults.resultIds);
      setDogs(dogDetails);
    } catch (error) {
      console.error("Error loading dogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBreedNames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, { withCredentials: true });
      setBreedNames(response.data);
    } catch (error) {
      console.error("Error loading breed names:", error);
    }
  };

  const applyLocationFilter = async () => {
    try {
      const filters = { city: locationCity, size: 100, from: 0 };
      const locationData = await searchLocations(filters);
      const filteredResults = locationData.results.filter(
        (loc: any) => loc.city.toLowerCase() === locationCity.toLowerCase()
      );
      const zipCodes = filteredResults.map((loc: any) => loc.zip_code);
      console.log("Filtered ZIP codes:", zipCodes);
      setLocationZipCodes(zipCodes);
    } catch (error) {
      console.error("Error applying location filter:", error);
    }
  };

  const clearLocationFilter = () => {
    setLocationCity('');
    setLocationZipCodes(null);
  };

  useEffect(() => {
    loadDogs();
    loadBreedNames();
  }, []);

  useEffect(() => {
    loadDogs(1);
  }, [selectedBreed, ageMin, ageMax, locationZipCodes, sortOrder, userHasToggledSort]);

  const totalPages = pagination ? Math.ceil(pagination.total / PAGE_SIZE) : 0;
  const paginationNumbers = totalPages ? getPaginationNumbers(currentPage, totalPages) : [];

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/', { replace: true });
      } else {
        console.error("Error during logout:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Nav Bar */}
      <header className="flex justify-between items-center mb-4">
        {/* Left: Logo */}
        <div className="w-1/4">
          <h1 className="text-2xl font-bold">Dog Page</h1>
        </div>
        {/* Center: Search Bar for Breed */}
        <div className="w-1/2">
          <BreedSearchBar 
            breeds={breedNames} 
            onSelect={(breed) => setSelectedBreed(breed)}
            placeholder="Search by Breed" 
          />
        </div>
        {/* Right: Filter, Favorites, Logout */}
        <div className="w-1/4 flex justify-end items-center gap-2 relative">
          <Button onClick={() => setShowFilters(!showFilters)} variant="filter">
            <i className="ri-filter-3-line"></i> Filter
          </Button>
          <Button onClick={() => navigate('/favorites')} variant="fav">
            Favorites
          </Button>
          <Button onClick={handleLogout} variant="logout">
            Logout
          </Button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute right-36 top-full mt-2 z-50 transition-all duration-900 ease-in-out bg-white border rounded p-2 shadow w-auto">
              {/* Sort by Breed */}
              <div className="mb-2">
                <h3 className="font-bold text-sm mb-1">Sort by Breed</h3>
                <div className="flex gap-2">
                  <Button onClick={() => { setUserHasToggledSort(true); setSortOrder('asc'); }} variant="sortBreed">
                    A → Z
                  </Button>
                  <Button onClick={() => { setUserHasToggledSort(true); setSortOrder('desc'); }} variant="sortBreed">
                    Z → A
                  </Button>
                </div>
              </div>
              {/* Age Filter */}
              <div className="mb-2">
                <h3 className="font-bold text-sm mb-1">Age</h3>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={ageMin !== null ? ageMin : ''} 
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : null;
                      setAgeMin(value !== null ? Math.max(0, Math.min(14, value)) : null);
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
                      setAgeMax(value !== null ? Math.max(0, Math.min(14, value)) : null);
                    }} 
                    className="border rounded px-2 py-1 w-16 text-xs"
                    min="0" 
                    max="14"
                  />
                </div>
              </div>
              {/* City Filter */}
              <div>
                <h3 className="font-bold text-sm mb-1">City</h3>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={locationCity} 
                    onChange={(e) => setLocationCity(e.target.value)} 
                    className="border rounded px-2 py-1 w-24 text-xs"
                  />
                  {locationZipCodes ? (
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
          )}
        </div>
      </header>

      {selectedBreed && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Search Results for: {selectedBreed}</h2>
          <Button onClick={() => { setSelectedBreed(null); loadDogs(1); }} variant="fav">
            Reset to Default
          </Button>
        </div>
      )}
      {loading ? (
        <p>Loading dogs...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <DogCard 
                key={dog.id} 
                dog={dog} 
                isFavorite={!!favorites.find((fav) => fav.id === dog.id)} 
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          {pagination && pagination.total > PAGE_SIZE && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button onClick={() => loadDogs(1)} disabled={currentPage === 1} variant="fav">
                {"<<"}
              </Button>
              <Button onClick={() => loadDogs(currentPage - 1)} disabled={currentPage === 1} variant="fav">
                {"<"}
              </Button>
              {paginationNumbers.map((page, index) => (
                <Button 
                  key={index} 
                  onClick={() => typeof page === "number" && loadDogs(page)} 
                  disabled={page === currentPage} 
                  variant="fav"
                  className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                  {page}
                </Button>
              ))}
              <Button onClick={() => loadDogs(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} variant="fav">
                {">"}
              </Button>
              <Button onClick={() => loadDogs(totalPages)} disabled={currentPage === totalPages || totalPages === 0} variant="fav">
                {">>"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DogSearchPage;
