// src/components/Pagination.tsx
import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginationNumbers: (number | string)[];
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginationNumbers,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <Button 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1} 
        variant="fav"
      >
        {"<<"}
      </Button>
      <Button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        variant="fav"
      >
        {"<"}
      </Button>
      {paginationNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            variant="fav"
            className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-3 py-1">
            {page}
          </span>
        )
      )}
      <Button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages || totalPages === 0} 
        variant="fav"
      >
        {">"}
      </Button>
      <Button 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages || totalPages === 0} 
        variant="fav"
      >
        {">>"}
      </Button>
    </div>
  );
};

export default Pagination;
