// src/components/DogList.tsx
import React from 'react';
import DogCard from './DogCard';
import Pagination from './Pagination';
import { Dog } from '../types';

interface DogListProps {
  // List of dog objects to display.
  dogs: Dog[];
  // List of dogs marked as favorites.
  favorites: Dog[];
  // Function to toggle favorite status for a dog.
  toggleFavorite: (dog: Dog) => void;
  // Array for pagination display.
  paginationNumbers: (number | string)[];
  // The current active page number.
  currentPage: number;
  // Total available pages.
  totalPages: number;
  // Handler function when page changes.
  onPageChange: (page: number) => void;
  // Indicates if the dog data is still loading.
  loading: boolean;
}

const DogList: React.FC<DogListProps> = ({
  dogs,
  favorites,
  toggleFavorite,
  paginationNumbers,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) => {
  // Return a simple loading message while data is being retrieved.
  if (loading) return <p>Loading dogs...</p>;

  return (
    <>
      {/* The grid container for displaying dog cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dogs.map((dog) => (
          // Rendering each dog's card with favorite status and toggle function.
          <DogCard 
            key={dog.id} 
            dog={dog} 
            isFavorite={!!favorites.find((fav) => fav.id === dog.id)} 
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      {/* Render pagination only if multiple pages are available */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          paginationNumbers={paginationNumbers}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default DogList;
