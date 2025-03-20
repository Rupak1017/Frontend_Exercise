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
    <div className="border rounded shadow p-4 w-72">
      <img 
        src={dog.img} 
        alt={dog.name} 
        className="w-full h-52 object-cover rounded mb-4" 
      />
      {/* Top row: Name and Age */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Name: {dog.name}</h2>
        <h2 className="font-bold text-lg">Age: {dog.age}</h2>
      </div>
      {/* Bottom row: Breed, Bone Icon, and ZIP */}
      <div className='flex flex-row justify-between'>
        <div className="mt-4 flex justify-between flex-col">
          <p className="font-semibold text-sm">Breed: {dog.breed}</p>
          <p className="font-semibold text-sm">ZIP: {dog.zip_code}</p>
        </div>
        <button 
          onClick={handleToggle} 
          className="transition transform duration-300 hover:scale-110 mx-2"
        >
          {favorite ? (
            <img 
              src="/images/bone_solid.png" 
              alt="Favorite Bone" 
              className="w-6 h-6"
            />
          ) : (
            <img 
              src="/images/bone_line.png" 
              alt="Unfavorited Bone" 
              className="w-6 h-6"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
