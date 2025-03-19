// src/pages/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogCard from '../components/DogCard';
import Button from '../components/Button'; // Reusable Button component
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
      {/* Back Button */}
      <Button onClick={() => navigate(-1)} variant="back">
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites selected.</p>
      ) : (
        <>
          {/* Get a Match Button */}
          <Button onClick={handleGetMatch} variant="match">
            Get a Match
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
