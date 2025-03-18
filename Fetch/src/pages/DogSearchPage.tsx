import React, { useEffect, useState } from 'react';
import DogCard from '../components/DogCard';
import { fetchDogsDetails, fetchDogsSearch } from '../api/dogs';
import { searchLocations } from '../api/locations';
import axios from 'axios';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import BreedSearchBar from '../components/BreedSearchBar';

interface SearchResults {
  resultIds: string[];
  total: number;
}

const PAGE_SIZE = 25;
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const DogSearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [breedNames, setBreedNames] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | null>(null);
  const [ageMax, setAgeMax] = useState<number | null>(null);
  const [locationCity, setLocationCity] = useState<string>('');
  const [locationZipCodes, setLocationZipCodes] = useState<string[] | null>(null);
  // Existing A–Z toggle for breed sorting
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // Flag to track manual toggle (if needed)
  const [userHasToggledSort, setUserHasToggledSort] = useState<boolean>(false);
  const navigate = useNavigate();

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
      // Use alphabetical breed sort by default (A→Z) if no age filter is applied; otherwise, include age filters.
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

  // Call location search API to filter locations by city and extract zip codes.
  const applyLocationFilter = async () => {
    try {
      const filters = { city: locationCity, size: 100, from: 0 };
      const locationData = await searchLocations(filters);
      // Extract ZIP codes from the returned locations.
      const zipCodes = locationData.results.map((loc: any) => loc.zip_code);
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

  // Toggle the alphabetical sort order (breed toggle).
  const toggleSortOrder = () => {
    setUserHasToggledSort(true);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const paginationNumbers = totalPages ? getPaginationNumbers(currentPage, totalPages) : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        {/* Left: Logo */}
        <div className="w-1/4">
          <h1 className="text-2xl font-bold">Dog Page</h1>
        </div>
        {/* Center: Breed Search, Age Filters, and Location Filter */}
        <div className="w-1/2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <BreedSearchBar breeds={breedNames} onSelect={(breed) => setSelectedBreed(breed)} />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min Age" 
                value={ageMin !== null ? ageMin : ''} 
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  setAgeMin(value !== null ? Math.max(0, Math.min(14, value)) : null);
                }} 
                className="border rounded px-2 py-1 w-20"
                min="0" 
                max="14"
              />
              <input 
                type="number" 
                placeholder="Max Age" 
                value={ageMax !== null ? ageMax : ''} 
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  setAgeMax(value !== null ? Math.max(0, Math.min(14, value)) : null);
                }} 
                className="border rounded px-2 py-1 w-20"
                min="0" 
                max="14"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="City" 
              value={locationCity} 
              onChange={(e) => setLocationCity(e.target.value)} 
              className="border rounded px-2 py-1 w-40"
            />
            <button onClick={applyLocationFilter} className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">
              Apply Location
            </button>
            {locationZipCodes && (
              <button onClick={clearLocationFilter} className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300">
                Clear Location
              </button>
            )}
          </div>
        </div>
        {/* Right: A–Z Toggle and Logout */}
        <div className="w-1/4 flex justify-end items-center gap-2">
          <button 
            onClick={toggleSortOrder} 
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
          >
            {sortOrder === 'asc' ? (
              <span>
                A → Z <i className="ri-arrow-up-s-line align-middle"></i>
              </span>
            ) : (
              <span>
                Z → A <i className="ri-arrow-down-s-line align-middle"></i>
              </span>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      {selectedBreed && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Search Results for: {selectedBreed}</h2>
          <button onClick={() => { setSelectedBreed(null); loadDogs(1); }} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Reset to Default
          </button>
        </div>
      )}
      {loading ? (
        <p>Loading dogs...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
          {pagination && pagination.total > PAGE_SIZE && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button onClick={() => loadDogs(1)} disabled={currentPage === 1} className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
                {"<<"}
              </button>
              <button onClick={() => loadDogs(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
                {"<"}
              </button>
              {paginationNumbers.map((page, index) => (
                <button key={index} onClick={() => typeof page === "number" && loadDogs(page)} disabled={page === currentPage} className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => loadDogs(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
                {">"}
              </button>
              <button onClick={() => loadDogs(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
                {">>"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DogSearchPage;
