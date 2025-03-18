// src/components/FavoritesButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog } from '../types';

interface FavoritesButtonProps {
  favorites: Dog[];
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ favorites }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/favorites', { state: { favorites } })}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Favorites
    </button>
  );
};

export default FavoritesButton;
