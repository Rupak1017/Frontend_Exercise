// src/pages/DogSearchPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchDogsDetails } from '../api/dogs';
import { searchLocations } from '../api/locations';
import axios from 'axios';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import DogList from '../components/DogList';
import { Dog } from '../types';
import Button from '../components/Button';

interface SearchResults {
  resultIds: string[];
  total: number;
}

const PAGE_SIZE = 20;
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const DogSearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [pagination, setPagination] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Breed search state
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [breedNames, setBreedNames] = useState<string[]>([]);

  // Age filters
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

  // Load persisted favorites from local storage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Helper to update favorites in local storage
  const updateFavoritesStorage = (newFavorites: Dog[]) => {
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Toggle a dog's favorite status
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

  // Generate pagination numbers, inserting ellipses when necessary
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

  // Load dogs from search API based on filters and pagination
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

  // Load breed names from the API
  const loadBreedNames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, { withCredentials: true });
      setBreedNames(response.data);
    } catch (error) {
      console.error("Error loading breed names:", error);
    }
  };

  // Update the location filter by fetching matching ZIP codes for the given city
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

  // Clear the location filter settings
  const clearLocationFilter = () => {
    setLocationCity('');
    setLocationZipCodes(null);
  };

  // Initial data load
  useEffect(() => {
    loadDogs();
    loadBreedNames();
  }, []);

  // Reload dogs when any of the filter/sort settings change
  useEffect(() => {
    loadDogs(1);
  }, [selectedBreed, ageMin, ageMax, locationZipCodes, sortOrder, userHasToggledSort]);

  const totalPages = pagination ? Math.ceil(pagination.total / PAGE_SIZE) : 0;
  const paginationNumbers = totalPages ? getPaginationNumbers(currentPage, totalPages) : [];

  // Log out the user and navigate to the homepage
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

  // Inject the Chatbase chat widget script after page load
  useEffect(() => {
    const container = document.getElementById("chat-widget-container");
    if (container && !document.getElementById("33AC8VBme6-RVatOGz0kz")) {
      const script = document.createElement("script");
      // This code snippet loads the Chatbase widget script into the container
      script.innerHTML = `(function(){
  if(!window.chatbase || window.chatbase("getState") !== "initialized"){
    window.chatbase = (...arguments) => {
      if(!window.chatbase.q){ window.chatbase.q = []; }
      window.chatbase.q.push(arguments);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop){
        if(prop==="q"){ return target.q; }
        return (...args) => target(prop, ...args);
      }
    });
  }
  const onLoad = function(){
    const s = document.createElement("script");
    s.src = "https://www.chatbase.co/embed.min.js";
    s.id = "33AC8VBme6-RVatOGz0kz";
    s.domain = "www.chatbase.co";
    document.getElementById("chat-widget-container").appendChild(s);
  };
  if(document.readyState === "complete"){
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }
})();`;
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black w-[85%] mx-auto px-4 p-6">
      <NavBar
        breedNames={breedNames}
        onBreedSelect={setSelectedBreed}
        selectedBreed={selectedBreed}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        sortOrder={sortOrder}
        onSetSortOrder={(order) => { setUserHasToggledSort(true); setSortOrder(order); }}
        ageMin={ageMin}
        ageMax={ageMax}
        onSetAgeMin={setAgeMin}
        onSetAgeMax={setAgeMax}
        locationCity={locationCity}
        onSetLocationCity={setLocationCity}
        applyLocationFilter={applyLocationFilter}
        clearLocationFilter={clearLocationFilter}
        locationZipCodes={locationZipCodes}
        onFavoritesClick={() => navigate('/favorites')}
        onLogout={handleLogout}
      />
      {selectedBreed && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Search Results for: {selectedBreed}</h2>
          <Button onClick={() => { setSelectedBreed(null); loadDogs(1); }} variant="fav">
            Reset to Default
          </Button>
        </div>
      )}
      <DogList
        dogs={dogs}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        paginationNumbers={paginationNumbers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => loadDogs(page)}
        loading={loading}
      />

      {/* Chatbot container fixed at bottom right; it allows Chatbase's own toggle/close functionality */}
      <div
        id="chat-widget-container"
        className="fixed bottom-4 right-4 z-50 w-80 h-96 md:w-64 md:h-72"
      ></div>
    </div>
  );
};

export default DogSearchPage;
