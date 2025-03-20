// src/pages/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogCard from '../components/DogCard';
import Button from '../components/Button';
import { Dog } from '../types';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const storedFavorites = localStorage.getItem("favorites");
  const favorites: Dog[] = storedFavorites ? JSON.parse(storedFavorites) : [];
  
  // State to hold the matched dog.
  const [matchDog, setMatchDog] = useState<Dog | null>(null);

  // Handler to randomly select a match from favorites.
  const handleGetMatch = () => {
    if (favorites.length === 0) return;
    const randomIndex = Math.floor(Math.random() * favorites.length);
    setMatchDog(favorites[randomIndex]);
  };

  // Close the modal.
  const closeMatch = () => {
    setMatchDog(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Content Container with consistent width */}
      <div className="w-[85%] mx-auto">
        {/* Custom Header in a single line for all screen sizes */}
        <div className="flex justify-between items-center mb-5 pb-5 mt-5 border-b border-black gap-2">
          <Button 
            onClick={() => navigate(-1)} 
            variant="back" 
            className="flex items-center gap-1 text-xs sm:text-base px-1 sm:px-2 py-1 sm:py-2"
          >
            <i className="ri-arrow-left-line text-base sm:text-xl"></i>
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-sm sm:text-3xl font-bold text-center flex-1">
            Your Favorites
          </h1>
          <Button 
            onClick={handleGetMatch} 
            variant="match" 
            className="flex items-center gap-1 text-xs sm:text-base px-1 sm:px-2 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">Get a Match</span>
            <i className="ri-heart-2-line text-base sm:text-xl"></i>
          </Button>
        </div>

        {favorites.length === 0 ? (
          <p className="text-center text-lg">No favorites selected.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((dog) => (
              <DogCard 
                key={dog.id} 
                dog={dog} 
                isFavorite={true} 
                onToggleFavorite={() => {}}  // No toggle on FavoritesPage for now
              />
            ))}
          </div>
        )}
      </div>

      {matchDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">It's a Match!</h2>
            <div className="flex justify-center">
              <DogCard 
                dog={matchDog} 
                isFavorite={true} 
                onToggleFavorite={() => {}} 
              />
            </div>
            <Button onClick={closeMatch} variant="close" className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FavoritesPage;
