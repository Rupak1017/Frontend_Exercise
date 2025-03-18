// src/pages/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogCard from '../components/DogCard';
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
    <div className="min-h-screen bg-gray-100 p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites selected.</p>
      ) : (
        <>
          <button 
            onClick={handleGetMatch} 
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Get a Match
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favorites.map((dog) => (
              <DogCard 
                key={dog.id} 
                dog={dog} 
                isFavorite={true} 
                onToggleFavorite={() => {}}  // No toggle on FavoritesPage for now
              />
            ))}
          </div>
        </>
      )}

      {matchDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">It's a Match!</h2>
            <DogCard 
              dog={matchDog} 
              isFavorite={true} 
              onToggleFavorite={() => {}} 
            />
            <button 
              onClick={closeMatch} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
