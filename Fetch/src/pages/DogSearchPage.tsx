import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import axios from 'axios';

const DogSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Use replace to remove /search from history
      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // If 401, session is already invalidated; redirect to login.
        console.warn('Session already invalidated.');
        navigate('/', { replace: true });
      } else {
        console.error("Error during logout:", error);
      }
    }
  };

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
      <div>
        <p className="text-center text-lg">[Dog search functionality coming soon]</p>
      </div>
    </div>
  );
};

export default DogSearchPage;
