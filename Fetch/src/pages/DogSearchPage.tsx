import React, { useEffect, useState } from 'react';
import DogCard from '../components/DogCard';
import { fetchDogsDetails } from '../api/dogs';
import axios from 'axios';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface SearchResults {
  resultIds: string[];
  total: number;
}

const PAGE_SIZE = 25;

const DogSearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const getPaginationNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    pages.push(1);
    if (currentPage > 4) {
      pages.push("...");
    }
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 4) {
      start = 2;
      end = 4;
    }
    if (currentPage >= totalPages - 3) {
      start = totalPages - 3;
      end = totalPages - 1;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 3) {
      pages.push("...");
    }
    pages.push(totalPages);
    return pages;
  };

  const loadDogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const queryString = `sort=breed:asc&size=${PAGE_SIZE}&from=${from}`;
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryString}`,
        { withCredentials: true }
      );
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

  useEffect(() => {
    loadDogs();
  }, []);

  const totalPages = pagination ? Math.ceil(pagination.total / PAGE_SIZE) : 0;
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Session already invalidated.');
        navigate('/', { replace: true });
      } else {
        console.error("Error during logout:", error);
      }
    }
  };

  const paginationNumbers = totalPages ? getPaginationNumbers(currentPage, totalPages) : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dog Search</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      {loading ? (
        <p>Loading dogs...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => loadDogs(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => loadDogs(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {paginationNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && loadDogs(page)}
                disabled={page === currentPage}
                className={`px-3 py-1 rounded ${
                  page === currentPage ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => loadDogs(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => loadDogs(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DogSearchPage;
