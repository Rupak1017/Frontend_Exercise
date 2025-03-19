// src/components/DogList.tsx
import React from 'react';
import DogCard from './DogCard';
import Pagination from './Pagination';
import { Dog } from '../types';

interface DogListProps {
  dogs: Dog[];
  favorites: Dog[];
  toggleFavorite: (dog: Dog) => void;
  paginationNumbers: (number | string)[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
  if (loading) return <p>Loading dogs...</p>;

  return (
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
