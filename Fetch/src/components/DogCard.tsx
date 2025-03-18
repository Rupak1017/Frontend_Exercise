// src/components/DogCard.tsx
import React, { useState, useEffect } from 'react';
import { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggle = () => {
    setFavorite(!favorite);
    onToggleFavorite(dog);
  };

  return (
    <div className="border rounded shadow p-4 flex flex-col items-center relative">
      <img src={dog.img} alt={dog.name} className="w-32 h-32 object-cover rounded mb-4" />
      <button onClick={handleToggle} className="absolute top-2 right-2">
        {favorite ? (
          <i className="ri-heart-fill text-red-500 text-xl"></i>
        ) : (
          <i className="ri-heart-line text-gray-500 text-xl"></i>
        )}
      </button>
      <div className="text-center">
        <h2 className="font-bold text-lg">{dog.name}</h2>
        <p>Age: {dog.age}</p>
        <p>Breed: {dog.breed}</p>
        <p>ZIP: {dog.zip_code}</p>
      </div>
    </div>
  );
};

export default DogCard;
